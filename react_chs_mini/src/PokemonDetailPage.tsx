import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "./api/axiosInstance";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";

// Pokemon 응답 타입 일부만 정의
type PokemonTypeItem = { type: { name: string } };
type PokemonAbilityItem = { ability: { name: string } };
type PokemonData = {
  name: string;
  sprites?: { front_default?: string | null };
  height?: number;
  weight?: number;
  types?: PokemonTypeItem[];
  abilities?: PokemonAbilityItem[];
};

type FormState = {
  name: string;
  description: string;
  type: string | "";
  height?: number | "";
  weight?: number | "";
  isFavorite: boolean;
  isPublic: boolean;
  isNotify: boolean;
  variant: "normal" | "shiny";
};

export default function PokemonDetailPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery<PokemonData | null>({  // useQuery 훅 사용: data, 로딩상태, 에러상태를 자동 관리
    queryKey: ["pokemon", id],     // 캐시 구분 키: ["pokemon", id] → id별로 캐시가 따로 저장됨 (예: "pokemon-1", "pokemon-2")
    queryFn: async () => {         // 실제 데이터를 가져오는 비동기 함수 정의 (query function)
      if (!id) throw new Error("No id"); // id가 없을 경우 쿼리 실행 중단 및 에러 발생시킴 (React Query에서 error 상태로 감)
      
      // PokeAPI에 GET 요청 보내기 (axios 인스턴스 사용)
      const res = await api.get(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(id)}` 
        // encodeURIComponent: id에 공백, 한글, 특수문자 등이 포함될 경우 URL 안전하게 인코딩
      );

      return res.data as PokemonData; // 응답 데이터를 PokemonData 타입으로 단언하여 반환
    },
    enabled: !!id,  // enabled: false면 쿼리 실행 안 함 → id가 존재(true)할 때만 쿼리 실행
  });

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    type: "",
    height: "",
    weight: "",
    isFavorite: false,
    isPublic: false,
    isNotify: false,
    variant: "normal",
  });

  // 파일 업로드 관련 상태
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // multiple 파일 업로드 상태: { file, url }
//   const [files, setFiles] = useState<Array<{ file: File; url: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // variant 하위 multiple 파일 업로드 상태 및 ref
  const [variantFiles, setVariantFiles] = useState<Array<{ file: File; url: string }>>(
    []
  );
  const variantFileInputRef = useRef<HTMLInputElement | null>(null);

  // variantFiles 언마운트 시 URL 해제
  useEffect(() => {
    return () => {
      variantFiles.forEach((f) => URL.revokeObjectURL(f.url));
    };
  }, [variantFiles]);

  useEffect(() => {
    if (!data) return;
    setForm((prev) => ({
      ...prev,
      name: data.name ?? "",
      description: "",
      type:
        data.types && data.types.length > 0 ? data.types[0].type.name : "",
      height: data.height ?? "",
      weight: data.weight ?? "",
      isFavorite: false,
      isPublic: false,
      isNotify: false,
      variant: "normal",
    }));
  }, [data]);

  // preview URL 정리
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => {
      URL.revokeObjectURL(url);
      setPreview(null);
    };
  }, [file]);

  if (isLoading)
    return (
      <Container sx={{ py: 6 }}>
        <CircularProgress />
      </Container>
    );
  if (error)
    return (
      <Container sx={{ py: 6 }}>
        <Typography color="error">데이터를 불러오는 중 오류가 발생했습니다.</Typography>
      </Container>
    );
  if (!data)
    return (
      <Container sx={{ py: 6 }}>
        <Typography>데이터가 없습니다.</Typography>
      </Container>
    );

  const handleCheckbox =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((s) => ({ ...s, [key]: e.target.checked }));
    };

  // 텍스트 / textarea 변경 핸들러 (명확한 이벤트 타입)
  const handleTextChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((s) => ({ ...s, [key]: e.target.value }));
    };

  // Select 변경 핸들러 (MUI 타입 사용)
  const handleSelectChange =
    (key: keyof FormState) =>
    (e: SelectChangeEvent<string>) => {
      setForm((s) => ({ ...s, [key]: e.target.value }));
    };

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // variant용 multiple 파일 핸들러
  const handleVariantFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;

    const newFileObjs = selected.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    const existingNames = new Set(variantFiles.map((f) => f.file.name));
    const filtered = newFileObjs.filter((f) => !existingNames.has(f.file.name));

    setVariantFiles((prev) => [...prev, ...filtered]);
    if (variantFileInputRef.current) variantFileInputRef.current.value = "";
  };

  const handleRemoveVariantFileAt = (index: number) => {
    setVariantFiles((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.url);
      const next = prev.slice(0, index).concat(prev.slice(index + 1));
      return next;
    });
  };

  const handleClearVariantFiles = () => {
    variantFiles.forEach((f) => URL.revokeObjectURL(f.url));
    setVariantFiles([]);
    if (variantFileInputRef.current) variantFileInputRef.current.value = "";
  };

  const handleSave = () => {
    // 실제 저장 로직 대신 데모: 콘솔/알림
    const payload = {
      ...form,
      uploadedFileName: file?.name ?? null,
    };
    console.log("저장할 데이터:", payload);
    alert("저장된 데이터:\n" + JSON.stringify(payload, null, 2));
  };

  const handleCancel = () => {
    // 이전 페이지로
    navigate(-1);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Button variant="text" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        목록으로
      </Button>

      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={3} alignItems="flex-start">
          <Box sx={{ minWidth: 140 }}>
            {/* 업로드된 프리뷰 우선, 없으면 API 스프라이트 노출 */}
            <img
              src={preview ?? data.sprites?.front_default ?? ""}
              alt={data.name}
              width={120}
              height={120}
              style={{ display: "block", marginBottom: 8, objectFit: "contain" }}
            />

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
              {data.types?.map((t: PokemonTypeItem) => (
                <Chip key={t.type.name} label={t.type.name} />
              ))}
            </Box>

            {/* 파일 인풋 UI */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                size="small"
              >
                파일 선택
                <input
                  ref={fileInputRef}
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>

              {file && (
                <>
                  <Typography variant="body2" sx={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {file.name}
                  </Typography>
                  <IconButton size="small" onClick={handleRemoveFile} aria-label="remove file">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom>
              상세 조회 / 수정
            </Typography>

            <Stack spacing={2}>
              {/* input */}
              <TextField
                label="Name"
                value={form.name}
                onChange={handleTextChange("name")}
                fullWidth
              />

              {/* textarea */}
              <TextField
                label="Description"
                value={form.description}
                onChange={handleTextChange("description")}
                fullWidth
                multiline
                minRows={3}
              />

              {/* selectbox */}
              <FormControl fullWidth>
                <InputLabel id="type-select-label">Primary Type</InputLabel>
                <Select
                  labelId="type-select-label"
                  value={form.type}
                  label="Primary Type"
                  onChange={handleSelectChange("type")}
                >
                  {(data.types ?? []).map((t) => (
                    <MenuItem key={t.type.name} value={t.type.name}>
                      {t.type.name}
                    </MenuItem>
                  ))}
                  {/* 예비 옵션 */}
                  <MenuItem value="">(none)</MenuItem>
                </Select>
              </FormControl>

              <Stack direction="row" spacing={2}>
                {/* number inputs */}
                <TextField
                  label="Height"
                  type="number"
                  value={form.height ?? ""}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      height:
                        e.target.value === "" ? "" : Number(e.target.value),
                    }))
                  }
                />
                <TextField
                  label="Weight"
                  type="number"
                  value={form.weight ?? ""}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      weight:
                        e.target.value === "" ? "" : Number(e.target.value),
                    }))
                  }
                />
              </Stack>

              <Divider />

              {/* checkbox */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.isFavorite}
                      onChange={handleCheckbox("isFavorite")}
                    />
                  }
                  label="즐겨찾기"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.isPublic}
                      onChange={handleCheckbox("isPublic")}
                    />
                  }
                  label="공개 여부"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.isNotify}
                      onChange={handleCheckbox("isNotify")}
                    />
                  }
                  label="알림 설정"
                />
              </div>

              {/* radiobutton */}
              <FormControl>
                <FormLabel>Variant</FormLabel>
                <RadioGroup
                  row
                  value={form.variant}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      variant: e.target.value as FormState["variant"],
                    }))
                  }
                >
                  <FormControlLabel
                    value="normal"
                    control={<Radio />}
                    label="Normal"
                  />
                  <FormControlLabel
                    value="shiny"
                    control={<Radio />}
                    label="Shiny"
                  />
                </RadioGroup>
              </FormControl>

              {/* multiple 파일 첨부 */}
              <Divider />
              <Typography variant="subtitle2">첨부파일</Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  size="small"
                >
                  첨부 파일 선택
                  <input
                    ref={variantFileInputRef}
                    hidden
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleVariantFilesChange}
                  />
                </Button>
                <Button variant="text" onClick={handleClearVariantFiles} size="small">
                  전체삭제
                </Button>
              </Box>

              <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(4, 1fr)" }}>
                {variantFiles.map((vf, idx) => (
                  <Box
                    key={vf.file.name + "_" + idx}
                    sx={{
                      position: "relative",
                      borderRadius: 1,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <img
                      src={vf.url}
                      alt={vf.file.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveVariantFileAt(idx)}
                      sx={{ position: "absolute", top: 2, right: 2, bgcolor: "rgba(255,255,255,0.7)" }}
                      aria-label="remove"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  pt: 1,
                }}
              >
                <Button variant="outlined" onClick={handleCancel}>
                  취소
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  저장
                </Button>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}