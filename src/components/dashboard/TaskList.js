import { Paper, List, ListItem, Checkbox, ListItemText } from '@mui/material';

export default function TaskList({ tasks, onToggle }) {
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id} disablePadding>
            <Checkbox checked={task.completed} onChange={() => onToggle(task.id)} />
            <ListItemText primary={task.label} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
