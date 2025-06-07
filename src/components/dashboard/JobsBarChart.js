import { Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function JobsBarChart({ data }) {
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="subtitle1" fontWeight={600}>Candidates on Jobs</Typography>
      <Box height={120}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="job" hide />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="count" fill="#90caf9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
