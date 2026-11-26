import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

export default function ColorModeToggle() {
    const { mode, systemMode, setMode } = useColorScheme();
    const current = mode === 'system' ? systemMode : mode;
    if(!current) return null;

    const next = current === 'dark' ? 'light' : 'dark';
    const label = next === 'dark' ? '切換為深色模式' : '切換為淺色模式';
    return (
        <Tooltip title={label}>
            <IconButton onClick={() => setMode(next)} aria-label={label} color="inherit">
                {current === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>
        </Tooltip>
    );
}
