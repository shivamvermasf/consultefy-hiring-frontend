import { Paper, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#1976d2', '#90caf9', '#bdbdbd'];

export default function EarningsPieChart({ value, data }) {
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="subtitle1" fontWeight={600}>Monthly Earnings</Typography>
      <Box display="flex" alignItems="center">
        <Typography variant="h4" fontWeight={700} sx={{ mr: 2 }}>${value.toLocaleString()}</Typography>
        <Box width={80} height={80}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={24} outerRadius={40} startAngle={90} endAngle={-270}>
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper>
  );
}
