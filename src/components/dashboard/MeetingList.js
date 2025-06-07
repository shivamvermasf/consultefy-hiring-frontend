import { Paper, List, ListItem, ListItemText, Box } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const colors = ['#1976d2', '#0288d1', '#388e3c', '#7b1fa2'];

export default function MeetingList({ meetings }) {
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
      <List>
        {meetings.map((meeting, idx) => (
          <ListItem key={meeting.id}>
            <FiberManualRecordIcon sx={{ color: colors[idx % colors.length], fontSize: 14, mr: 1 }} />
            <ListItemText
              primary={meeting.label}
              secondary={meeting.time}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
