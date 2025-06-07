import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 220;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Candidates', icon: <PeopleIcon />, path: '/candidates' },
  { label: 'Opportunities', icon: <BusinessIcon />, path: '/opportunities' },
  { label: 'Jobs', icon: <WorkIcon />, path: '/jobs' },
  { label: 'Monthly Invoice', icon: <ReceiptIcon />, path: '/monthly-invoice' },
  { label: 'Certificates', icon: <VerifiedIcon />, path: '/certificates' },
  { label: 'Admin', icon: <AdminPanelSettingsIcon />, path: '/admin' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#23272f', color: '#fff' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight={700}>Consulting Firm</Typography>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.label}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon sx={{ color: '#90caf9' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem button key="Logout" onClick={() => {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          navigate("/login");
        }}>
          <ListItemIcon sx={{ color: '#90caf9' }}><AdminPanelSettingsIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
}
