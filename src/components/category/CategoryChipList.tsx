import React from 'react';
import { Chip, Box } from '@mui/material';
import { Category } from '../../features/category/types';

interface CategoryChipListProps {
  categories: Category[];
  onClick?: (category: Category) => void;
}

const CategoryChipList: React.FC<CategoryChipListProps> = ({ categories, onClick }) => {
  return (
    <Box display="flex" flexWrap="wrap" gap={1}>
      {categories.map((category) => (
        <Chip
          key={category.id}
          label={category.name}
          sx={{ backgroundColor: category.color, color: '#fff' }}
          onClick={() => onClick?.(category)}
        />
      ))}
    </Box>
  );
};

export default CategoryChipList;
