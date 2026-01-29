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
  name: string;
  koName: string;
}

interface Props {
  onSearch: (englishName: string) => void;
}

export default function PokemonSearch({ onSearch }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null); // ✅ 에러 상태 추가

  const handleFinalSearch = (queryText: string) => {
    const query = queryText.trim();
    if (!query) return;

    setError(null); // 검색 시작 시 에러 초기화

    const bracketMatch = query.match(/\(([^)]+)\)/);
    const searchTarget = bracketMatch ? bracketMatch[1] : query;

    const found = POKEMON_OPTIONS.find(
      (opt) =>
        opt.koName === searchTarget ||
        opt.name.toLowerCase() === searchTarget.toLowerCase()
    );

    if (found) {
      onSearch(found.name);
      setInputValue("");
    } else {
      // ✅ 알럿 대신 텍스트로 안내
      setError(`"${searchTarget}"은(는) 없는 이름입니다.`);
    }
  };

  return (
    <Box sx={{ width: { xs: "100%", md: 450 }, mx: "auto" }}>
      <Autocomplete<PokemonOption>
        options={POKEMON_OPTIONS}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : `${option.koName} (${option.name})`
        }
        inputValue={inputValue}
        onInputChange={(_, val) => {
          setInputValue(val);
          if (error) setError(null); // 타이핑 시작하면 에러 메시지 숨김
        }}
        
        onChange={(_, val) => {
          if (val) {
            const target = typeof val === "string" ? val : val.name;
            handleFinalSearch(target);
          }
        }}
        
        slots={{
          paper: (props) => (
            <Paper {...props} elevation={8} sx={{ borderRadius: "16px", mt: 1 }} />
          ),
        }}

        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="포켓몬 검색 (한글/영어)..."
            error={!!error} // ✅ 에러 발생 시 빨간색 보더
            helperText={error} // ✅ 하단에 에러 메시지 표시
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // MUI의 기본 선택 동작과 겹치지 않게 처리
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
                        backgroundColor: error ? "#d32f2f" : "#3b82f6",
                        color: "#fff",
                        "&:hover": { backgroundColor: error ? "#c62828" : "#2563eb" },
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
                borderRadius: "50px",
                border: error ? "2px solid #d32f2f" : "2px solid #e2e8f0",
                transition: "all 0.2s",
                "& fieldset": { border: "none" },
              },
              "& .MuiFormHelperText-root": {
                textAlign: "center",
                fontWeight: 600,
                mt: 1
              }
            }}
          />
        )}
        
        renderOption={(props, option) => {
          const { key, ...otherProps } = props as any;
          return (
            <Box component="li" key={key} {...otherProps} sx={{ px: 2, py: 1.5, display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>{option.koName}</Typography>
              <Typography variant="caption" sx={{ color: "#94a3b8" }}>{option.name}</Typography>
            </Box>
          );
        }}
      />
    </Box>
  );
}