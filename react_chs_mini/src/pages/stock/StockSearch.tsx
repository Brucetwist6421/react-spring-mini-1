import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Box, CircularProgress, IconButton, Paper, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import api from '../../api/axiosInstance';

interface SearchResult {
  code: string;
  name: string;
}

interface StockSearchProps {
  onSearch: (value: string) => void;
  initialValue?: string;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSearch, initialValue = "" }) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [options, setOptions] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query || query.length < 1) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get<SearchResult[]>(`/api/stock/search/${query}`);
      setOptions(response.data);
    } catch (error) {
      console.error("검색어 로드 실패:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions(inputValue);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue, fetchSuggestions]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: { xs: '100%', md: 350 },
        border: '1px solid #e0e0e0',
        borderRadius: 2
      }}
    >
      <Autocomplete
        fullWidth
        freeSolo
        disableClearable
        options={options}
        getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.name} (${option.code})`)}
        onInputChange={(_, newInputValue) => { // 💡 사용하지 않는 첫 번째 인자 event를 '_'로 변경
          setInputValue(newInputValue);
        }}
        onChange={(_, newValue) => { // 💡 사용하지 않는 첫 번째 인자 event를 '_'로 변경
          if (newValue && typeof newValue !== 'string') {
            onSearch(newValue.code);
          } else if (typeof newValue === 'string') {
            onSearch(newValue);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="종목명 또는 코드 입력"
            size="small"
            variant="standard"
            sx={{ ml: 1, flex: 1 }}
            // 💡 InputProps 대신 slotProps를 사용 (MUI 최신 권장 방식)
            slotProps={{
              input: {
                ...params.InputProps,
                disableUnderline: true,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }
            }}
          />
        )}
        renderOption={(props, option) => {
        // props에서 key를 추출하되, 변수로 선언하지 않고 바로 사용합니다.
        // MUI v6에서는 props에 이미 key가 포함되어 전달되는 경우가 많습니다.
        return (
            <Box 
            component="li" 
            {...props}           // key를 포함한 모든 props를 전개 (사용하지 않는 변수 할당 없음)
            key={option.code}    // 하지만 안정성을 위해 고유한 key(종목코드)를 명시적으로 재할당
            sx={{ fontSize: '0.9rem' }}
            >
            <Box sx={{ fontWeight: 'bold', mr: 1 }}>{option.name}</Box>
            <Box sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>{option.code}</Box>
            </Box>
        );
        }}
      />
      <IconButton onClick={() => onSearch(inputValue)} sx={{ p: '10px' }}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default StockSearch;