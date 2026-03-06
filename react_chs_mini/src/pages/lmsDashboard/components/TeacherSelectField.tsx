import { Autocomplete, TextField, CircularProgress, InputAdornment } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import React, { useEffect, useState } from 'react';
import api from "../../../api/axiosInstance";

interface Teacher {
  accountSeq: number;
  accountId: string;
  accountName: string;
}

interface Props {
  value: number | null;
  onChange: (seq: number | null) => void;
  error?: boolean;
  helperText?: string;
}

const TeacherSelectField: React.FC<Props> = ({ value, onChange, error, helperText }) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/account/teachers');
        setTeachers(response.data);
      } catch (err) {
        console.error("교사 목록 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  return (
    <Autocomplete
      options={teachers}
      // 현재 값과 일치하는 객체를 찾음
      value={teachers.find(t => t.accountSeq === value) || null}
      getOptionLabel={(option) => `${option.accountName} (${option.accountId})`}
      loading={loading}
      onChange={(_, newValue) => onChange(newValue ? newValue.accountSeq : null)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="담당 교사"
          required
          error={error}
          helperText={helperText}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start"><PersonIcon fontSize="small" /></InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }
          }}
        />
      )}
    />
  );
};

export default TeacherSelectField;