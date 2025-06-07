import { Paper, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalaryChart({ data }) {
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="subtitle1" fontWeight={600}>Monthly Salaries</Typography>
      <Box height={120}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" hide />
            <YAxis hide />
            <Tooltip />
            <Line type="monotone" dataKey="salary" stroke="#1976d2" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Typography variant="caption" color="text.secondary">$30k</Typography>
    </Paper>
  );
}
