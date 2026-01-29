/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Autocomplete,
  TextField,
  InputAdornment,
  Box,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { POKEMON_OPTIONS } from "../../../api/datas/pokemonData";

interface PokemonOption {
  id: number;     // 번호 필드 추가
  name: string;
  koName: string;
}

interface Props {
  onSearch: (englishName: string) => void;
}

export default function PokemonSearch({ onSearch }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFinalSearch = (queryText: string) => {
    const query = queryText.trim();
    if (!query) return;

    setError(null);

    // 괄호 제거 로직 (선택된 옵션 대응)
    const bracketMatch = query.match(/\(([^)]+)\)/);
    const searchTarget = bracketMatch ? bracketMatch[1] : query;

    const found = POKEMON_OPTIONS.find(
      (opt) =>
        opt.koName === searchTarget ||
        opt.name.toLowerCase() === searchTarget.toLowerCase() ||
        opt.id.toString() === searchTarget // 번호(ID)로 검색 가능하도록 추가
    );

    if (found) {
      onSearch(found.name);
      setInputValue("");
    } else {
      setError(`"${searchTarget}"은(는) 존재하지 않습니다.`);
    }
  };

  return (
    <Box sx={{ width: { xs: "100%", md: 500 }, mx: "auto" }}>
      <Autocomplete<PokemonOption>
        options={POKEMON_OPTIONS}
        // 검색 필터 로직 확장: 한글, 영문, 번호 모두 검색 대상에 포함
        filterOptions={(options, state) => {
          const search = state.inputValue.toLowerCase();
          return options.filter(
            (opt) =>
              opt.koName.includes(search) ||
              opt.name.toLowerCase().includes(search) ||
              opt.id.toString().includes(search)
          );
        }}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : `${option.koName} (${option.name})`
        }
        inputValue={inputValue}
        onInputChange={(_, val) => {
          setInputValue(val);
          if (error) setError(null);
        }}
        onChange={(_, val) => {
          if (val) {
            handleFinalSearch(val.name);
          }
        }}
        slots={{
          paper: (props) => (
            <Paper 
              {...props} 
              elevation={8} 
              sx={{ 
                borderRadius: "12px", 
                mt: 1,
                border: '1px solid #e2e8f0',
                '& .MuiAutocomplete-listbox': { p: 0 } 
              }} 
            />
          ),
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="포켓몬 이름 또는 번호(#) 검색..."
            error={!!error}
            helperText={error}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if ((e as any).defaultMuiPrevented) return;
                const hasHighlight = document.querySelector('[data-focus="true"]');
                if (hasHighlight) return;
                handleFinalSearch(inputValue);
              }
            }}
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: error ? "#d32f2f" : "#94a3b8", ml: 1 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleFinalSearch(inputValue)}
                      sx={{
                        backgroundColor: error ? "#d32f2f" : "#1e293b", // 디자인에 맞춰 어두운 톤으로 변경 가능
                        color: "#fff",
                        "&:hover": { backgroundColor: error ? "#c62828" : "#000" },
                      }}
                    >
                      <SearchIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#ffffff",
                borderRadius: "12px", // 대시보드 테마와 통일 (0 또는 12px 추천)
                border: error ? "2px solid #d32f2f" : "2px solid #e2e8f0",
                transition: "all 0.2s",
                "& fieldset": { border: "none" },
              },
              "& .MuiFormHelperText-root": { textAlign: "center", fontWeight: 700, mt: 1 }
            }}
          />
        )}
        
        // 드롭다운 목록에 번호 표시 최적화
        renderOption={(props, option) => {
          const { key, ...otherProps } = props as any;
          return (
            <Box 
              component="li" 
              key={key} 
              {...otherProps} 
              sx={{ 
                px: 2, py: 1, 
                display: "flex", 
                alignItems: "center",
                borderBottom: '1px solid #f1f5f9',
                '&:last-child': { borderBottom: 'none' }
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 800, width: 45 }}>
                #{String(option.id).padStart(3, '0')}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, flexGrow: 1 }}>
                {option.koName}({option.name})
              </Typography>
              {/* <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                {option.name}
              </Typography> */}
            </Box>
          );
        }}
      />
    </Box>
  );
}