import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import TaskSection from '../sections/TaskSection';
import NoteSection from '../sections/NoteSection';
import CalendarSection from '../sections/CalendarSection';
import CategorySection from '../sections/CategorySection';
import CalendarList from '../components/calendar/CalendarList';
import MonthlyCalendar from '../components/calendar/MonthlyCalendar';

const Dashboard: React.FC = () => {
  return (
    <Box p={2} sx={{ height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Left Column: 15% width on medium+ screens */}
        <Grid
          item
          xs={12}
          md={2}
          sx={{
            flexBasis: { md: '15%' },
            flexGrow: 0,
            flexShrink: 0
          }}
        >
          <Box display="flex" flexDirection="column" height="100%">
            {/* Top Left Panel: Calendars and Categories */}
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" mb={1}>
                Calendars
              </Typography>
              <CalendarList />
              <Box mt={2}>
                <CategorySection />
              </Box>
            </Paper>
            {/* Bottom Left Panel: Mini Calendar */}
            <Paper elevation={2} sx={{ p: 2, flexGrow: 1 }}>
              <Typography variant="h6" mb={1}>
                Mini Calendar
              </Typography>
              <MonthlyCalendar selectedDate={null} onChange={function (date: Date): void {
                throw new Error('Function not implemented.');
              } } />
            </Paper>
          </Box>
        </Grid>

        {/* Middle Column: Main Calendar (remaining space) */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <CalendarSection />
          </Paper>
        </Grid>

        {/* Right Column: Notes and Tasks */}
        <Grid item xs={12} md={3}>
          <Box display="flex" flexDirection="column" height="100%">
            {/* Top Right Panel: Notes */}
            <Paper elevation={2} sx={{ p: 2, mb: 2, flexGrow: 1 }}>
              <Typography variant="h6" mb={1}>
                Notes
              </Typography>
              <NoteSection />
            </Paper>
            {/* Bottom Right Panel: Tasks */}
            <Paper elevation={2} sx={{ p: 2, flexGrow: 1 }}>
              <Typography variant="h6" mb={1}>
                Tasks
              </Typography>
              <TaskSection />
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
