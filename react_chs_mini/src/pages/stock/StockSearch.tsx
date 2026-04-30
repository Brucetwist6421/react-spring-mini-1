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
        // 1. 현재 입력된 값이 문자열인지 객체인지 판단하여 라벨 표시
        getOptionLabel={(option) => (typeof option === 'string' ? option : `${option.name} (${option.code})`)}
        
        // 2. 검색창에 글자를 칠 때만 inputValue 업데이트
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}

        // 3. 옵션을 '클릭'하거나 엔터를 쳤을 때 실행
        onChange={(_, newValue) => {
          if (newValue && typeof newValue !== 'string') {
            // ✅ 클릭한 옵션의 코드로 바로 검색 실행
            onSearch(newValue.code);
            // ✅ 핵심: 검색 버튼이 참조할 inputValue를 클릭된 텍스트로 업데이트
            setInputValue(newValue.code); 
          } else if (typeof newValue === 'string') {
            onSearch(newValue);
            setInputValue(newValue);
          }
        }}
        
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="종목명 또는 코드 입력"
            size="small"
            variant="standard"
            sx={{ ml: 1, flex: 1 }}
            // 엔터 키 대응
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch(inputValue);
              }
            }}
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
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.code} sx={{ fontSize: '0.9rem' }}>
            <Box sx={{ fontWeight: 'bold', mr: 1 }}>{option.name}</Box>
            <Box sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>{option.code}</Box>
          </Box>
        )}
      />
      <IconButton 
        onClick={() => {
          // 현재 상태값인 inputValue로 검색 실행
          onSearch(inputValue);
        }} 
        sx={{ p: '10px' }}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default StockSearch;