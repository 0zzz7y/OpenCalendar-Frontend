import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types/task';
import { RecurringPattern } from '../../types/shared';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// MUI Icons for actions
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// Icon for the calendar dot indicator (using a small circle)
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';  // calendar icon for date field

interface TaskCardProps {
  task: Task;
  calendar?: { name: string; color: string };   // calendar info (name and color) for display
  category?: { name: string; color: string };   // category info for display
  onEdit: (updatedTask: Task) => void;          // callback to save edits
  onDelete: (taskId: string) => void;           // callback to delete task
  onUpdate?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, calendar, category, onEdit, onDelete, onUpdate }) => {
  // Local state for expansion and editing
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Local state for editable fields (so we can modify before confirming)
  const [editName, setEditName] = useState(task.name);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editDate, setEditDate] = useState(task.endDate || task.startDate || '');  // assuming endDate as due date if provided
  const [editRecurring, setEditRecurring] = useState<RecurringPattern>(task.recurringPattern);

  // Determine card background color (category color if available, otherwise a default)
  const cardColor = category?.color || '#f5f5f5';  // use category color, or a light grey if no category

  // Toggle expansion (collapse/expand)
  const handleToggleExpand = () => {
    setExpanded(prev => !prev);
  };

  // Enter edit mode (also expand the card to show fields)
  const handleStartEdit = () => {
    setExpanded(true);
    setIsEditing(true);
  };

  // Save edits and exit edit mode
  const handleConfirmEdit = () => {
    // Construct updated task object
    const updatedTask: Task = {
      ...task,
      name: editName,
      description: editDescription || undefined,
      // Assuming date field is endDate for due date (adjust based on actual usage)
      endDate: editDate || undefined,
      recurringPattern: editRecurring
    };
    onEdit(updatedTask);          // notify parent about the updated task
    setIsEditing(false);          // exit edit mode
    // (we keep the card expanded after editing so user can see changes; could also collapse if desired)
  };

  // Delete task handler
  const handleDelete = () => {
    onDelete(task.id);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    const updatedTask = { ...task, status: newStatus };
    onUpdate?.(updatedTask);
  };

  return (
    <Card 
      sx={{ 
        backgroundColor: cardColor, 
        borderRadius: 2, 
        boxShadow: 1, 
        border: '1px solid rgba(0,0,0,0.1)', 
        mb: 1 // margin-bottom between task cards
      }}
    >
      <CardContent sx={{ p: 1 }}>
        {/* Header: Collapse/Expand button on left, Edit/Confirm and Delete on right */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <IconButton onClick={handleToggleExpand} size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <Box>
            {isEditing ? (
              <IconButton onClick={handleConfirmEdit} size="small" sx={{ mr: 1 }}>
                <CheckIcon />
              </IconButton>
            ) : (
              <IconButton onClick={handleStartEdit} size="small" sx={{ mr: 1 }}>
                <EditIcon />
              </IconButton>
            )}
            <IconButton onClick={handleDelete} size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Task Name field (always visible). 
            In view mode, make it read-only; in edit mode, allow typing. */}
        <TextField 
          variant="outlined" 
          size="small"
          fullWidth 
          value={isEditing ? editName : task.name}
          onChange={(e) => setEditName(e.target.value)}
          placeholder="Task name"
          InputProps={{
            readOnly: !isEditing
          }}
          sx={{ backgroundColor: '#ffffff' }}
        />

        {/* Only show additional fields if card is expanded (details visible) */}
        { expanded && (
          <Stack spacing={1} mt={1}>
            {/* Description field */}
            <TextField 
              variant="outlined" 
              size="small" 
              fullWidth
              value={isEditing ? editDescription : (task.description || '')}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Opis"  /* "Description" */
              InputProps={{ readOnly: !isEditing }}
              sx={{ backgroundColor: '#ffffff' }}
            />
            {/* Date field (start or end date). Display with a calendar icon. */}
            <TextField 
              variant="outlined" 
              size="small" 
              fullWidth
              value={isEditing ? editDate : (task.endDate || task.startDate || '')}
              onChange={(e) => setEditDate(e.target.value)}
              placeholder="Data (dd/MM/yyyy/hh:mm)"  /* Date placeholder format */
              InputProps={{ 
                readOnly: !isEditing,
                endAdornment: (
                  <IconButton size="small" disabled={!isEditing}>
                    <CalendarTodayIcon fontSize="small" />
                  </IconButton>
                )
              }}
              sx={{ backgroundColor: '#ffffff' }}
            />
            {/* Recurring pattern field */}
            { isEditing ? (
              // Editable select dropdown for recurring pattern
              <TextField 
                variant="outlined" 
                size="small" 
                select 
                fullWidth
                label="Powtarzanie" /* "Repeat" label in Polish */
                value={editRecurring}
                onChange={(e) => setEditRecurring(e.target.value as RecurringPattern)}
                sx={{ backgroundColor: '#ffffff' }}
              >
                {/* Menu options for each recurring pattern value */}
                {Object.values(RecurringPattern).map(pattern => (
                  <MenuItem key={pattern} value={pattern}>
                    {pattern.charAt(0) + pattern.slice(1).toLowerCase()}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              // Read-only display of recurring pattern (if any)
              task.recurringPattern && task.recurringPattern !== RecurringPattern.NONE && (
                <TextField 
                  variant="outlined" 
                  size="small" 
                  fullWidth
                  value={task.recurringPattern.charAt(0) + task.recurringPattern.slice(1).toLowerCase()}
                  InputProps={{ readOnly: true }}
                  sx={{ backgroundColor: '#ffffff' }}
                />
              )
            )}
            {/* Calendar and Category labels (read-only, with colored dots). 
                Show these if the info is available. */}
            {calendar && (
              <Box display="flex" alignItems="center" sx={{ backgroundColor: '#ffffff', borderRadius: 1, p: '4px 8px' }}>
                <FiberManualRecordIcon sx={{ color: calendar.color, fontSize: 'small', mr: 1 }} />
                <Typography variant="body2">{calendar.name}</Typography>
              </Box>
            )}
            {category && (
              <Box display="flex" alignItems="center" sx={{ backgroundColor: '#ffffff', borderRadius: 1, p: '4px 8px' }}>
                <FiberManualRecordIcon sx={{ color: category.color, fontSize: 'small', mr: 1 }} />
                <Typography variant="body2">{category.name}</Typography>
              </Box>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
