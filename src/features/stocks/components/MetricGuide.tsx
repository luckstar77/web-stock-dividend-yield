import EventAvailableOutlined from '@mui/icons-material/EventAvailableOutlined';
import PaidOutlined from '@mui/icons-material/PaidOutlined';
import SavingsOutlined from '@mui/icons-material/SavingsOutlined';
import TimerOutlined from '@mui/icons-material/TimerOutlined';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

interface Metric {
    icon: ReactNode;
    title: string;
    description: string;
}

const METRICS: Metric[] = [
    {
        icon: <EventAvailableOutlined />,
        title: '填權息成功率',
        description: '以年為單位，一年內每次除權息都在之後回到除權息前收盤價，那一年才算填權息成功。',
    },
    {
        icon: <TimerOutlined />,
        title: '填息天數',
        description: '從除權息日起，到收盤價第一次回到除權息前收盤價所經過的天數（日曆天）。',
    },
    {
        icon: <PaidOutlined />,
        title: '平均現金殖利率',
        description: '每次的現金股利 ÷ 除權息前一日收盤價，同一年加總後，再把各年平均。',
    },
    {
        icon: <SavingsOutlined />,
        title: '平均還原殖利率',
        description: '把配股以除權息參考價換算成價值，與現金股利一起計算的殖利率，再把各年平均。',
    },
];

export default function MetricGuide() {
    return (
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
            {METRICS.map((metric) => (
                <Card key={metric.title}>
                    <CardContent>
                        <Box sx={{ color: 'primary.main', mb: 1 }}>{metric.icon}</Box>
                        <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 700, mb: 0.5 }}>{metric.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{metric.description}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
