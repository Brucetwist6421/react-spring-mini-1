import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
    Box,
    Button,
    Checkbox,
    Chip,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../../api/axiosInstance";
import SampleSwal from "../../components/SampleSwal";
import RandomSpinner from "../../components/RandomSpinner";

type FormState = {
  name: string;
  description: string;
  type: string;
  height: number | "";
  weight: number | "";
  isFavorite: boolean;
  isPublic: boolean;
  isNotify: boolean;
  variant: "normal" | "shiny";
};

export default function PokemonCreatePage() {
  const navigate = useNavigate();

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

  // main image single
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState<string | null>(null);
  const mainRef = useRef<HTMLInputElement | null>(null);

  // attachments multiple
  const [attachments, setAttachments] = useState<Array<{ file: File; url: string }>>([]);
  const attachRef = useRef<HTMLInputElement | null>(null);

  // sample type list (원하면 API로 가져오세요)
  const [typeOptions] = useState<string[]>([
    "normal",
    "fire",
    "water",
    "grass",
    "electric",
    "psychic",
    "ice",
    "dragon",
    "dark",
    "fairy",
  ]);

  useEffect(() => {
    if (!mainFile) {
      setMainPreview(null);
      return;
    }
    // 이미지 확장자 확인
    const isImage = /\.(jpe?g|png|gif|webp)$/i.test(mainFile.name);
    if (!isImage) {
      alert("이미지 파일만 업로드 가능합니다."); // 경고 메시지
      setMainPreview(null);
      setMainFile(null); // mainFile 상태 초기화
      if (mainRef.current) mainRef.current.value = ""; // input 초기화
      return;
    }

    console.log("mainFile changed:", mainFile);
    const url = URL.createObjectURL(mainFile);
    setMainPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [mainFile]);

  useEffect(() => {
    return () => {
      attachments.forEach((a) => URL.revokeObjectURL(a.url));
    };
  }, [attachments]);

  const handleText = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((s) => ({ ...s, [key]: e.target.value }));

  const handleSelect = (key: keyof FormState) => (e: SelectChangeEvent<string>) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

  const handleCheckbox = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((s) => ({ ...s, [key]: e.target.checked }));

  const handleMainFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setMainFile(f);
  };
  const removeMainFile = () => {
    setMainFile(null);
    if (mainRef.current) mainRef.current.value = "";
  };

  const handleAttachments = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const newObjs = selected.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    // 중복 파일명 방지
    const existing = new Set(attachments.map((a) => a.file.name));
    setAttachments((prev) => [...prev, ...newObjs.filter((n) => !existing.has(n.file.name))]);
    if (attachRef.current) attachRef.current.value = "";
  };
  const removeAttachment = (i: number) => {
    setAttachments((prev) => {
      const removed = prev[i];
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.slice(0, i).concat(prev.slice(i + 1));
    });
  };
  const clearAttachments = () => {
    attachments.forEach((a) => URL.revokeObjectURL(a.url));
    setAttachments([]);
    if (attachRef.current) attachRef.current.value = "";
  };

  const validate = () => {
    if (!form.name.trim()) {
      alert("이름을 입력하세요.");
      return false;
    }
    return true;
  };

  // 체크 박스 값을 1/0으로 변환
  const boolToNum = (v: boolean) => (v ? "1" : "0");

  // 1. useMutation 훅 정의
  const createPokemonMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      console.log("전송 FormData (mutation):", Array.from(formData.entries()));
      // API POST 요청 실행
      const res = await api.post("/pokemon/createPokemon", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      console.log("서버 응답:", data);
      SampleSwal.fire({
        title: "등록되었습니다.",
        // text: "text입력",
        icon: "success",
      });
      // 예: 성공 시 이동
      navigate("/pokemon2/" + data.id);
    },
    onError: (error) => {
      console.error("등록 중 오류 발생:", error);
      alert("등록 중 오류가 발생했습니다.");
    },
  });

  // 2. handleSubmit 내부에서 mutate 호출
  const handleSubmit = () => {
    // 유효성 검증
    if (!validate()) return;

    SampleSwal.fire({
      title: "데이터를 등록하시겠습니까?",
      // text: "되돌릴수 없다니깡!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "예",
      cancelButtonText: "아니오",
    }).then((result) => {
      if (result.isConfirmed) {
        // setUserInput("삭제가 완료");
        // formData 생성 시작
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("description", form.description);
        fd.append("type", form.type);
        fd.append("height", String(form.height));
        fd.append("weight", String(form.weight));
        fd.append("isFavorite", boolToNum(form.isFavorite));
        fd.append("isPublic", boolToNum(form.isPublic));
        fd.append("isNotify", boolToNum(form.isNotify));
        fd.append("variant", form.variant);
        if (mainFile) fd.append("mainImage", mainFile);
        attachments.forEach((a) => fd.append("attachmentFiles", a.file));

        for (const [key, value] of fd.entries()) {
          console.log(`${key}:`, value);
        }
        // // formData 생성 끝

        // React Query로 전송 (기존 axios.post 대신)
        createPokemonMutation.mutate(fd);

      } else {
        return;
      }
    });
  };

  // 등록 시 spinner 작동
  // mutation명.isPending 추가 하면 됨
  if (
      createPokemonMutation.isPending
    ) {
      return <RandomSpinner />;
    }

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 3}}>
        <Typography variant="h5" gutterBottom>
          포켓몬 등록
        </Typography>

        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Box sx={{ minWidth: 160 }}>
              <Box sx={{ mb: 1 }}>
                <img
                  src={mainPreview ?? "https://mblogthumb-phinf.pstatic.net/MjAxOTEwMjdfMTI4/MDAxNTcyMTU4OTEwNzI2.XrBHHBuiTESxgjZ96cxz3I1FAsi1so1HpkuDxqGYjYAg.zQQKNoDVIGxzcxrz4__Dnt6nXbtWczXzgpdXjGP4MsUg.GIF.msjin93/IMG_8483.GIF?type=w800"}
                  alt="main"
                  style={{ width: 140, height: 140, objectFit: "contain", background: "#f5f5f5" }}
                />
              </Box>
              <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                대표 이미지 선택
                <input ref={mainRef} hidden type="file" accept="image/*" onChange={handleMainFile} />
              </Button>
              <Button sx={{ ml: 1 }} color="inherit" onClick={removeMainFile}>
                삭제
              </Button>

            </Box>

            <Box sx={{ flex: 1 }}>
              <TextField label="이름" value={form.name} onChange={handleText("name")} fullWidth />
              <TextField label="설명" value={form.description} onChange={handleText("description")} multiline minRows={3} fullWidth sx={{ mt: 1 }} />

              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="create-type-label">타입</InputLabel>
                <Select labelId="create-type-label" value={form.type} label="타입" onChange={handleSelect("type")}>
                  {typeOptions.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <TextField label="Height" type="number" value={form.height} onChange={(e) => setForm((s) => ({ ...s, height: e.target.value === "" ? "" : Number(e.target.value) }))} />
                <TextField label="Weight" type="number" value={form.weight} onChange={(e) => setForm((s) => ({ ...s, weight: e.target.value === "" ? "" : Number(e.target.value) }))} />
              </Stack>

              <Box sx={{ mt: 1 }}>
                <FormControlLabel control={<Checkbox checked={form.isFavorite} onChange={handleCheckbox("isFavorite")} />} label="즐겨찾기" />
                <FormControlLabel control={<Checkbox checked={form.isPublic} onChange={handleCheckbox("isPublic")} />} label="공개" />
                <FormControlLabel control={<Checkbox checked={form.isNotify} onChange={handleCheckbox("isNotify")} />} label="알림" />
              </Box>

              <Box sx={{ mt: 1 }}>
                <FormLabel>Variant</FormLabel>
                <RadioGroup row value={form.variant} onChange={(e) => setForm((s) => ({ ...s, variant: e.target.value as FormState["variant"] }))}>
                  <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                  <FormControlLabel value="shiny" control={<Radio />} label="Shiny" />
                </RadioGroup>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <FormLabel>첨부파일</FormLabel>
                <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                  첨부 선택
                  <input ref={attachRef} hidden type="file" accept="image/*" multiple onChange={handleAttachments} />
                </Button>
                <Button onClick={clearAttachments}>전체삭제</Button>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                {attachments.map((a, i) => (
                  <Box key={a.file.name + "_" + i} sx={{ position: "relative" }}>
                    <img src={a.url} alt={a.file.name} style={{ width: 100, height: 100, objectFit: "cover" }} />
                    <IconButton size="small" onClick={() => removeAttachment(i)} sx={{ position: "absolute", top: 0, right: 0 }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                <Button onClick={() => navigate("/newPokemonList")}>목록</Button>
                <Button variant="contained" onClick={handleSubmit}>
                  등록
                </Button>
              </Box>
            </Box>
          </Stack>

          <Divider />

          <Box>
            <Typography variant="subtitle2">미리보기 정보</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Chip label={`이름: ${form.name || "-"}`} />
              <Chip label={`타입: ${form.type || "-"}`} />
              <Chip label={`Variant: ${form.variant}`} />
              <Chip label={`첨부: ${attachments.length}`} />
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}