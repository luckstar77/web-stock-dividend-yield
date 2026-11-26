import ExpandMore from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';

const RULES = [
    '填權息：除權息日當天或之後，收盤價第一次回到「除權息前收盤價」以上，就算填權息。',
    '填權息成功率：以年為單位，一年內所有的除權息都填了，那一年才算成功。',
    '現金殖利率 = 現金股利 ÷ 除權息前一日收盤價；還原殖利率 =（現金股利 + 配股價值）÷ 除權息前一日收盤價。',
    '配股價值 = 每股配股數 × 除權息參考價；同一年的殖利率加總後，再把各年平均。',
    '現金增資（要付錢認購的除權）不是股利，不算進去。',
    '上市自 2004 年 2 月、上櫃自 2007 年 12 月起統計，因為交易所的每日收盤行情只提供到這裡。',
];

export default function Methodology() {
    return (
        <Accordion variant="outlined" disableGutters sx={{ borderRadius: 1, '&::before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>統計方式說明</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography component="ul" variant="body2" color="text.secondary" sx={{ m: 0, pl: 2.5, '& li': { mb: 0.75 } }}>
                    {RULES.map((rule) => <li key={rule}>{rule}</li>)}
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
}
