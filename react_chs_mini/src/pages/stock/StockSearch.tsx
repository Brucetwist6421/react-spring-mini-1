import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Paper, TextField } from '@mui/material';
import React, { useState } from 'react';

interface StockSearchProps {
  onSearch: (value: string) => void;
  initialValue?: string;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSearch, initialValue = "" }) => {
  const [inputValue, setInputValue] = useState(initialValue);

  const handleSearch = () => {
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: { xs: '100%', md: 300 },
        border: '1px solid #e0e0e0',
        borderRadius: 2
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="종목명 또는 코드 입력"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        variant="standard"
        sx={{ ml: 1, flex: 1 }}
        InputProps={{
          disableUnderline: true,
        }}
      />
      <IconButton onClick={handleSearch} sx={{ p: '10px' }}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default StockSearch;