import React from 'react';
import { Box, Typography } from '@mui/material';
import CategoryList from '../components/category/CategoryList';

const CategorySection: React.FC = () => {
  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        Categories
      </Typography>
      <CategoryList children={undefined} defaultWidth={''} defaultHeight={''} defaultX={0} defaultY={0} />
    </Box>
  );
};

export default CategorySection;
