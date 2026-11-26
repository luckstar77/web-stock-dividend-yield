#!/usr/bin/env bash
# One-time setup for the GitHub Actions deploy (README > CI/CD). Run it in AWS CloudShell
# (or anywhere the AWS CLI is signed in with IAM admin rights):
#
#   bash setup-aws-deploy-role.sh                       # finds the bucket and distribution of stock.imallenlai.com
#   SITE_DOMAIN=example.com bash setup-aws-deploy-role.sh
#
# It creates (or updates) an IAM role that only the "production" environment of this repo can assume
# through GitHub OIDC, so no long-lived AWS keys are stored in GitHub. The role may only upload to the
# site's bucket and invalidate its CloudFront distribution.
set -euo pipefail

REPO="${REPO:-luckstar77/web-stock-dividend-yield}"
SITE_DOMAIN="${SITE_DOMAIN:-stock.imallenlai.com}"
ROLE_NAME="${ROLE_NAME:-github-deploy-web-stock-dividend-yield}"
OIDC_HOST="token.actions.githubusercontent.com"

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

if [ -z "${DISTRIBUTION_ID:-}" ]; then
    DISTRIBUTION_ID=$(aws cloudfront list-distributions \
        --query "DistributionList.Items[?Aliases.Items && contains(Aliases.Items, '${SITE_DOMAIN}')].Id | [0]" --output text)
fi
if [ -z "$DISTRIBUTION_ID" ] || [ "$DISTRIBUTION_ID" = "None" ]; then
    echo "No CloudFront distribution has the alias ${SITE_DOMAIN}; set DISTRIBUTION_ID=... and run again." >&2
    exit 1
fi

if [ -z "${S3_BUCKET:-}" ]; then
    ORIGIN=$(aws cloudfront get-distribution --id "$DISTRIBUTION_ID" \
        --query 'Distribution.DistributionConfig.Origins.Items[0].DomainName' --output text)
    # Both "<bucket>.s3.<region>.amazonaws.com" and the website endpoint "<bucket>.s3-website-<region>.amazonaws.com"
    S3_BUCKET=$(echo "$ORIGIN" | sed -E 's/\.s3([.-].*)?\.amazonaws\.com$//')
fi
# get-bucket-location answers "None" for us-east-1
BUCKET_REGION=$(aws s3api get-bucket-location --bucket "$S3_BUCKET" --query LocationConstraint --output text)
if [ "$BUCKET_REGION" = "None" ]; then BUCKET_REGION=us-east-1; fi
echo "Distribution: $DISTRIBUTION_ID   Bucket: $S3_BUCKET ($BUCKET_REGION)"

PROVIDER_ARN="arn:aws:iam::${ACCOUNT_ID}:oidc-provider/${OIDC_HOST}"
if ! aws iam get-open-id-connect-provider --open-id-connect-provider-arn "$PROVIDER_ARN" >/dev/null 2>&1; then
    aws iam create-open-id-connect-provider --url "https://${OIDC_HOST}" --client-id-list sts.amazonaws.com >/dev/null
    echo "Created the GitHub OIDC provider"
fi

TRUST_POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "${PROVIDER_ARN}" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "${OIDC_HOST}:aud": "sts.amazonaws.com",
        "${OIDC_HOST}:sub": "repo:${REPO}:environment:production"
      }
    }
  }]
}
EOF
)

DEPLOY_POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": ["s3:ListBucket"], "Resource": "arn:aws:s3:::${S3_BUCKET}" },
    { "Effect": "Allow", "Action": ["s3:PutObject", "s3:GetObject"], "Resource": "arn:aws:s3:::${S3_BUCKET}/*" },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"],
      "Resource": "arn:aws:cloudfront::${ACCOUNT_ID}:distribution/${DISTRIBUTION_ID}"
    }
  ]
}
EOF
)

if aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
    aws iam update-assume-role-policy --role-name "$ROLE_NAME" --policy-document "$TRUST_POLICY"
else
    aws iam create-role --role-name "$ROLE_NAME" --assume-role-policy-document "$TRUST_POLICY" \
        --description "GitHub Actions deploy of ${REPO}" >/dev/null
fi
aws iam put-role-policy --role-name "$ROLE_NAME" --policy-name deploy-site --policy-document "$DEPLOY_POLICY"

ROLE_ARN=$(aws iam get-role --role-name "$ROLE_NAME" --query Role.Arn --output text)
cat <<EOF

Done. Run these on your own computer (gh CLI) to give the workflow what it needs:

  gh secret set AWS_ROLE_ARN --repo ${REPO} --body '${ROLE_ARN}'
  gh secret set AWS_S3_BUCKET --repo ${REPO} --body '${S3_BUCKET}'
  gh secret set AWS_CLOUDFRONT_DISTRIBUTION_ID --repo ${REPO} --body '${DISTRIBUTION_ID}'
  gh variable set AWS_REGION --repo ${REPO} --body '${BUCKET_REGION}'
  gh workflow run ci.yml --repo ${REPO} --ref master
EOF
