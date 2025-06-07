import { Paper, Typography, Box } from '@mui/material';

export default function StatCard({ icon, label, value, sublabel }) {
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
      <Box display="flex" alignItems="center" mb={1}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1 }}>{label}</Typography>
      </Box>
      <Typography variant="h3" fontWeight={700}>{value}</Typography>
      {sublabel && <Typography color="text.secondary">{sublabel}</Typography>}
    </Paper>
  );
}
