## 流程
- 建立 SPA 採用 CRA
- 建立首頁
  - 搜尋欄
  - 打 API 到後台取得殖利率資料
    - 填權息成功率
    - 除權息次數
    - 填權息次數
    - 統計年分
    - 歷年平均現金殖利率
    - 歷年平均還原殖利率

## 後台 API
- 取得股票殖利率資訊 <http://localhost:3000/stock?search=1474>  
  - query
    - search `string` 可搜尋股票代號或者名稱
```
{
    "_id" : ObjectId("633f9857e6cf9c59ea2747a5"),
    "id" : "1474",
    "allAvgCashYields" : 2.87,
    "allAvgRetroactiveYields" : NumberInt(6),
    "amountOfDividend" : NumberInt(27),
    "amountOfSuccess" : NumberInt(22),
    "dividendYearEnd" : "2022",
    "dividendYearStart" : "1991",
    "name" : "弘裕",
    "successRate" : 81.48148148148148,
    "updated" : ISODate("2022-10-07T03:09:11.182+0000")
}

```

## 參考技術文章
- [在s3上架設網站](https://blog.cloudthat.com/step-by-step-guide-to-deploy-reactjs-app-on-aws-s3/)
- [CRA自定義環境變數](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [cloudfront連結s3權限問題](https://aws.amazon.com/tw/premiumsupport/knowledge-center/s3-website-cloudfront-error-403/)
- [cloudfront連結s3經由https](https://www.youtube.com/watch?v=2VpsKK0nZi8)

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
