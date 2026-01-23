import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "./api/axiosInstance";
import { fileListDownload } from "./fileListDownload";
import SampleSwal from "./SampleSwal";
import RandomSpinner from "./Spinners";

// Pokemon 응답 타입 일부만 정의
type PokemonTypeItem = { type: { name: string } };
type PokemonAbilityItem = { ability: { name: string } };
// 실습 2 시작
// 🔹 변경/추가: 서버에서 오는 첨부파일 타입 정의
type PokemonAttachment = { id: number; pokemonId: number; fileName: string };
// 실습 2 끝

type PokemonData = {
  id : number;
  name: string;
  sprites?: { front_default?: string | null };
  height?: number;
  weight?: number;
  types?: PokemonTypeItem[];
  abilities?: PokemonAbilityItem[];

  // 실습 3 시작
  // 변경/추가: mainImagePath 외 기존에 없던 데이터 추가
  description?: string;
  mainImagePath?: string;
  attachments?: PokemonAttachment[];
  isFavorite?: number; // 0/1
  isPublic?: number;   // 0/1
  isNotify?: number;   // 0/1
  variant?: string;
  type: string;
  // variant 관련 데이터는 따로 없음
  // 실습 3 끝
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

  // React Query를 사용하여 포켓몬 데이터를 비동기로 불러오는 로직
  // 실습 1 시작
  const { data, isLoading, isFetching, error } = useQuery<PokemonData | null>({  // useQuery 훅 사용: data, 로딩상태, 에러상태를 자동 관리
    queryKey: ["pokemon", id],     // 캐시 구분 키: ["pokemon", id] → id별로 캐시가 따로 저장됨 (예: "pokemon-pikachu")
    queryFn: async () => {         // 실제 데이터를 가져오는 비동기 함수 정의 (query function)
      if (!id) throw new Error("No id"); // id가 없을 경우 쿼리 실행 중단 및 에러 발생시킴 (React Query에서 error 상태로 감)
      
      // PokeAPI에 GET 요청 보내기 (axios 인스턴스 사용)
      const res = await api.get(
        `http://168.107.51.143:8080/pokemon/${encodeURIComponent(id)}` 
        // encodeURIComponent: id에 공백, 한글, 특수문자 등이 포함될 경우 URL 안전하게 인코딩
      );
      console.log("Fetched data:", res.data);
      return res.data as PokemonData; // 응답 데이터를 PokemonData 타입으로 단언하여 반환
    },
    enabled: !!id,  // enabled: false면 쿼리 실행 안 함 → id가 존재(true)할 때만 쿼리 실행
  });
  // 실습 1 끝

  // 실습 5 시작
  // 1. useMutation 훅 정의
  const updatePokemonMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      console.log("전송 FormData (mutation):", Array.from(formData.entries()));
      // API POST 요청 실행
      const res = await api.post("/pokemon/updatePokemon", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log(id);
      

      return res.data;
    },
    onSuccess: (data) => {
      console.log("서버 응답:", data);
      SampleSwal.fire({
        title: "수정되었습니다.",
        // text: "text",
        icon: "success",
      });
      // 성공 시 이동
      // navigate("/pokemon2/"+id);
      // 수정모드 원복
      setIsEditMode(false);
    },
    onError: (error) => {
      console.error("수정 중 오류 발생:", error);
      alert("수정 중 오류가 발생했습니다.");
    },
  });
  // 실습 5 끝

  // 실습 7 시작
  // 1. useMutation 훅 정의
  const deletePokemonMutation = useMutation({
    mutationFn: async (pokemonId : number) => {
      console.log("전송된 pokemonId :", pokemonId);
      // API DELETE 요청 실행
      const res = await api.delete(`/pokemon/deletePokemon/${pokemonId}`);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("서버 응답:", data);
      SampleSwal.fire({
        title: "삭제되었습니다.",
        // text: "text",
        icon: "success",
      });
      // 성공 시 이동
      navigate("/");
    },
    onError: (error) => {
      console.error("삭제 중 오류 발생:", error);
      alert("삭제 중 오류가 발생했습니다.");
    },
  });
  // 실습 7 끝

  // useState 모음 시작
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

  // **수정 모드 상태 추가**
  const [isEditMode, setIsEditMode] = useState(false);

  // Select용 기본 타입 배열
  const basicTypes = ["normal", "ice", "earth", "fire", "grass", "wind", "poison", "water", "iron"];

  // 파일 업로드 관련 상태
  // 메인 이미지
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  // const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  // 첨부 파일 업로드 상태: { file, url }
  // const [files, setFiles] = useState<Array<{ file: File; url: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // variant 하위 multiple 파일 업로드 상태 및 ref
  const [variantFiles, setVariantFiles] = useState<Array<{ file?: File; url: string; id?: number }>>([]);
  const variantFileInputRef = useRef<HTMLInputElement | null>(null);

  // const [userInput, setUserInput] = useState("");

  // useState 모음 끝
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
      id: data.id,
      name: data.name ?? "",
      description: data.description ?? "",
      type: data.type ?? "",  // <- 여기 수정
      height: data.height ?? "",
      weight: data.weight ?? "",
      isFavorite: !!data.isFavorite, // 0/1 → boolean
      isPublic: !!data.isPublic,     // 0/1 → boolean
      isNotify: !!data.isNotify,     // 0/1 → boolean
      variant:
        data.variant === "normal" || data.variant === "shiny"
          ? data.variant
          : "normal",
    }));

    // 메인 이미지 미리보기 설정
  // if (data.mainImagePath) {
  //   setMainImagePreview(`http://localhost:5174/upload/${data.mainImagePath}`);
  // } else {
  //   setMainImagePreview(null);
  // }

  // 첨부파일 미리보기 설정
  if (data.attachments && data.attachments.length > 0) {
    const initialFiles = data.attachments
      // .filter(att => /\.(jpe?g|png|gif|webp)$/i.test(att.fileName))
      .map(att => ({
        url: `http://168.107.51.143:8080/upload/${att.fileName}`,
        id: att.id,
      }));
    setVariantFiles(initialFiles);
  } else {
    setVariantFiles([]);
  }

  }, [data]);

  // preview URL 정리
  useEffect(() => {
    if (!file) return;
    // 이미지 확장자 확인
    const isImage = /\.(jpe?g|png|gif|webp)$/i.test(file.name);
    if (!isImage) {
      alert("이미지 파일만 업로드 가능합니다."); // 경고 메시지
      setPreview(null); // <- preview만 초기화
      if (fileInputRef.current) fileInputRef.current.value = ""; // input 초기화
      setFile(null); // <- file 상태 초기화 (File | null)
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => {
      URL.revokeObjectURL(url);
      setPreview(null);
    };
  }, [file]);

  // 상세조회 및 update, delete 시 spinner 호출
  if (
    isLoading || isFetching ||
    updatePokemonMutation.isPending ||
    deletePokemonMutation.isPending
  ) {
    return <RandomSpinner />;
  }
  if (error)
    return (
      <Container sx={{ py: 6 }}>
        <Typography color="error">
          데이터를 불러오는 중 오류가 발생했습니다.
        </Typography>
      </Container>
    );
  if (!data)
    return (
      <Container sx={{ py: 6 }}>
        <Typography>데이터가 없습니다.</Typography>
      </Container>
    );



  // 체크박스 변경 핸들러 (명확한 이벤트 타입)
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

  // 메인 이미지 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  // 파일 제거 핸들러
  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 첨부파일용 multiple 파일 핸들러
  const handleVariantFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;

    const newFileObjs = selected.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    const existingNames = new Set(
      variantFiles
        .filter((f) => f.file)
        .map((f) => f.file!.name)
    );
    const filtered = newFileObjs.filter((f) => !existingNames.has(f.file.name));

    setVariantFiles((prev) => [...prev, ...filtered]);
    if (variantFileInputRef.current) variantFileInputRef.current.value = "";
  };

  // 첨부파일용 개별 삭제 핸들러
  const handleRemoveVariantFileAt = (index: number) => {
    setVariantFiles((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.url);
      const next = prev.slice(0, index).concat(prev.slice(index + 1));
      return next;
    });
  };

  // 첨부파일용 전체 삭제 핸들러
  const handleClearVariantFiles = () => {
    variantFiles.forEach((f) => URL.revokeObjectURL(f.url));
    setVariantFiles([]);
    if (variantFileInputRef.current) variantFileInputRef.current.value = "";
  };

  // 실습 6 시작
  // 체크 박스 값을 1/0으로 변환
  const boolToNum = (v: boolean) => (v ? "1" : "0");

  // 유효성 검사
  const validate = () => {
    if (!form.name.trim()) {
      alert("이름을 입력하세요.");
      return false;
    }
    return true;
  };

  const handleUpdate = () => {
    if (!validate()) return;

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
    fd.append("id", Number(data.id).toString());

    console.log("file:", file);
    console.log("첨부파일", variantFiles);
    // 메인 이미지 처리
    if (file) {
      // 새로 선택된 파일이 있으면 그걸 사용
      fd.append("mainImage", file);
    } else if (data?.mainImagePath) {
      // 새 파일 없고 기존 이미지가 있으면 기존 이미지명 전송
      fd.append("mainImagePath", data.mainImagePath);
    }

    // 첨부파일들
    const existingIds: number[] = [];
    variantFiles.forEach((vf) => {
      if (vf.file) {
        // 새로 업로드된 파일
        fd.append("attachmentFiles", vf.file);
      } else if (vf.id) {
        // 기존 첨부파일 ID 수집
        existingIds.push(vf.id);
      }
    });

    // 기존 파일 ID 배열을 FormData에 추가
    existingIds.forEach((id) => fd.append("existingAttachmentIdList", String(id)));

    for (const [key, value] of fd.entries()) {
      console.log(`${key}:`, value);
    }

    console.log("전송 FormData (update):", Array.from(fd.entries()));

    // React Query mutate 사용
    updatePokemonMutation.mutate(fd);
  };
  // 실습 6 끝

  // 실습 8 시작
  const handleDelete = () => {
    SampleSwal.fire({
      title: "데이터를 삭제하시겠습니까?",
      // text: "text 입력!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "예",
      cancelButtonText: "아니오",
    }).then((result) => {
      if (result.isConfirmed) {
        // setUserInput("삭제가 완료");
        const id = data.id;
        if (!id) {
          alert("유효하지 않은 포켓몬 ID입니다.");
          return;
        }
        console.log("삭제할 포켓몬 ID:", id);
        // React Query mutate 사용
        deletePokemonMutation.mutate(id);

      } else {
        return;
      }
    });
  };
  // 실습 8 끝

  const handleCancel = () => {
    // 이전 페이지로
    navigate("/");
  };

  const imageSrc =
  preview ??
  (data.mainImagePath
    ? `http://168.107.51.143:8080/upload/${data.mainImagePath}`
    : data.sprites?.front_default);


  return (
    <Container sx={{ py: 4 }}>
      <Button variant="text" onClick={() => navigate("/")} sx={{ mb: 2 }}>
        목록으로
      </Button>

      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={3} alignItems="flex-start">
          <Box sx={{ minWidth: 140 }}>
            {/* 실습 4 시작 */}
            {/* 🔹 변경/추가: 업로드된 프리뷰 우선, 없으면 mainImagePath or API 스프라이트 노출 */}
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={data.name}
                width={120}
                height={120}
                style={{ display: "block", marginBottom: 8, objectFit: "contain" }}
              />
            ) : (
              <div style={{ width: 120, height: 120, background: "#eee" }}>
                <Box sx={{ mb: 1 }}>
                <img
                  src={"https://mblogthumb-phinf.pstatic.net/MjAxOTEwMjdfMTI4/MDAxNTcyMTU4OTEwNzI2.XrBHHBuiTESxgjZ96cxz3I1FAsi1so1HpkuDxqGYjYAg.zQQKNoDVIGxzcxrz4__Dnt6nXbtWczXzgpdXjGP4MsUg.GIF.msjin93/IMG_8483.GIF?type=w800"}
                  alt="main"
                  style={{ width: 140, height: 140, objectFit: "contain", background: "#f5f5f5" }}
                />
                </Box>
              </div>
            )}

            {/* 실습 4 끝 */}

            {/* 파일 인풋 UI */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                size="small"
                disabled={!isEditMode} // 상세조회 시 비활성화
              >
                파일 선택
                <input
                  ref={fileInputRef}
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={!isEditMode} // 상세조회 시 비활성화
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
                slotProps={{
                  input: {
                    readOnly: !isEditMode , // 내부 input에 readOnly 적용
                  },
                }} // 상세조회 시 비활성화
              />

              {/* textarea */}
              <TextField
                label="Description"
                value={form.description}
                onChange={handleTextChange("description")}
                fullWidth
                multiline
                minRows={3}
                slotProps={{
                  input: {
                    readOnly: !isEditMode , // 내부 input에 readOnly 적용
                  },
                }} // 상세조회 시 비활성화
              />

              {/* selectbox */}
              
              <FormControl fullWidth>
                {!isEditMode ? (
                  <TextField
                    value={form.type}
                    fullWidth
                    slotProps={{
                      input: {
                        readOnly: true, // 내부 input에 readOnly 적용
                      },
                    }}
                    label="Primary Type"
                  />
                ) : (
                  <FormControl fullWidth>
                    <InputLabel id="type-select-label">Primary Type</InputLabel>
                    <Select
                      labelId="type-select-label"
                      value={form.type}
                      label="Primary Type"
                      onChange={handleSelectChange("type")}
                    >
                      {basicTypes.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                      <MenuItem value="">(none)</MenuItem>
                    </Select>
                  </FormControl>
                )}
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
                  slotProps={{
                    input: {
                      readOnly: !isEditMode , // 내부 input에 readOnly 적용
                    },
                  }} // 상세조회 시 비활성화
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
                  slotProps={{
                    input: {
                      readOnly: !isEditMode , // 내부 input에 readOnly 적용
                    },
                  }} // 상세조회 시 비활성화
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
                      disabled={!isEditMode} // 클릭 방지
                      sx={{
                        color: 'text.primary',
                        '&.Mui-checked': { color: 'primary.main' }, // 체크 시 색상
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: 'text.primary', // 항상 검정/주요 색상
                        opacity: 1, // disabled 시 투명도 제거
                      }}
                    >
                      즐겨찾기
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.isPublic}
                      onChange={handleCheckbox("isPublic")}
                      disabled={!isEditMode} // 클릭 방지
                      sx={{
                        color: 'text.primary',
                        '&.Mui-checked': { color: 'primary.main' }, // 체크 시 색상
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: 'text.primary', // 항상 검정/주요 색상
                        opacity: 1, // disabled 시 투명도 제거
                      }}
                    >
                      공개 여부
                    </Typography>
                  }
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.isNotify}
                      onChange={handleCheckbox("isNotify")}
                      disabled={!isEditMode} // 클릭 방지
                      sx={{
                        color: 'text.primary',
                        '&.Mui-checked': { color: 'primary.main' }, // 체크 시 색상
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: 'text.primary', // 항상 검정/주요 색상
                        opacity: 1, // disabled 시 투명도 제거
                      }}
                    >
                      알림 설정
                    </Typography>
                  }
                />
              </div>

              {/* radiobutton */}
              <FormControl>
                <FormLabel>노말 여부</FormLabel>
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
                    control={
                      <Radio
                        disabled={!isEditMode} // 클릭 방지
                        sx={{
                          color: 'text.primary',
                          '&.Mui-checked': { color: 'primary.main' },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          color: 'text.primary',
                          opacity: 1, // disabled 시 투명도 제거
                        }}
                      >
                        Normal
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="shiny"
                    control={
                      <Radio
                        disabled={!isEditMode}
                        sx={{
                          color: 'text.primary',
                          '&.Mui-checked': { color: 'primary.main' },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          color: 'text.primary',
                          opacity: 1,
                        }}
                      >
                        Shiny
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>

              {/* multiple 파일 첨부 */}
              <Divider />
              {isEditMode && (
                <>
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

                  <Divider />
                </>
              )}  

              <Typography variant="subtitle2">첨부파일 미리 보기</Typography>
                {/*
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                {data.types?.map((t: PokemonTypeItem) => (
                  <Chip key={t.type.name} label={t.type.name} />
                ))}
                */}
                {/* 🔹 변경/추가: attachments 이미지 미리보기 */}
                {/*
                {data.attachments?.map((att) => {
                  const isImage = /\.(jpe?g|png|gif|webp)$/i.test(att.fileName);
                  if (!isImage) return null;
                  const url = `http://localhost:5174/upload/${att.fileName}`;
                  return (
                    <Box key={att.id} sx={{ position: "relative" }}>
                      <img
                        src={url}
                        alt={att.fileName}
                        style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 4 }}
                      />
                    </Box>
                  );
                })}
              </Box>
              */}

              <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(4, 1fr)" }}>
              {variantFiles.map((vf, idx) => {
                // 이미지 파일 검증
                const isImage = vf.file
                  ? /\.(jpe?g|png|gif|webp)$/i.test(vf.file.name)
                  : /\.(jpe?g|png|gif|webp)$/i.test(vf.url);

                // 동영상 파일 검증
                const isVideo = vf.file
                  ? /\.(mp4|webm|ogg|mov|avi)$/i.test(vf.file.name)
                  : /\.(mp4|webm|ogg|mov|avi)$/i.test(vf.url);

                // const fileName = vf.file?.name ?? vf.url.split("/").pop();

                // 이미지 파일은 썸네일 표시
                if (isImage) {
                  return (
                    <Box
                      key={`${vf.file?.name ?? vf.id ?? vf.url ?? idx}`}
                      sx={{
                        position: "relative",
                        borderRadius: 1,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        cursor: isEditMode ? "default" : "pointer", // 수정 모드 시 커서 변경
                      }}
                      onClick={() => {
                        if (!isEditMode) {
                          fileListDownload(vf); // 수정 모드가 아니면 다운로드
                        }
                      }}
                    >
                      <a 
                      // href={vf.url} // url 이동 필요 시 주석 해제
                      style={{display: "block", width: "100%", height: "100%" }}>
                        <img
                          src={vf.url}
                          alt={`${vf.file?.name ?? vf.id ?? vf.url ?? idx}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </a>
                      {isEditMode && (
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveVariantFileAt(idx)}
                          sx={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            bgcolor: "rgba(255,255,255,0.7)",
                          }}
                          aria-label="remove"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  );
                }

                // 동영상 파일 처리
                if (isVideo) {
                  return (
                    <Box
                      key={`${vf.file?.name ?? vf.id ?? vf.url ?? idx}`}
                      sx={{
                        position: "relative",
                        borderRadius: 1,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "black",
                      }}
                    >
                      <video
                        controls
                        src={vf.url}
                        preload="metadata"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          console.warn("비디오 재생 실패:", vf.url);
                          e.currentTarget.poster = "https://mblogthumb-phinf.pstatic.net/MjAxOTEwMjdfMTI4/MDAxNTcyMTU4OTEwNzI2.XrBHHBuiTESxgjZ96cxz3I1FAsi1so1HpkuDxqGYjYAg.zQQKNoDVIGxzcxrz4__Dnt6nXbtWczXzgpdXjGP4MsUg.GIF.msjin93/IMG_8483.GIF?type=w800"; // 대체 이미지 표시
                          SampleSwal.fire({
                            title: "이 브라우저에서 지원하지 않는 동영상 형식입니다.",
                            // text: "text",
                            icon: "error",
                          });
                        }}
                      >
                        브라우저가 video 태그를 지원하지 않습니다.
                      </video>
                      {isEditMode && (
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveVariantFileAt(idx)}
                          sx={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            bgcolor: "rgba(255,255,255,0.7)",
                          }}
                          aria-label="remove"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  );
                }

                // 문서 파일(.pdf, .docx, 등)은 아이콘 + 파일명으로 표시
                return (
                  <Paper
                    key={`${vf.file?.name ?? vf.id ?? vf.url ?? idx}`}
                    sx={{
                      p: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      minHeight: 40,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                        if (!isEditMode) {
                          fileListDownload(vf); // 수정 모드가 아니면 다운로드
                        }
                      }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <UploadFileIcon color="action" />
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ maxWidth: 120 }}
                        title={vf.file?.name ?? vf.url}
                      >
                        {vf.file?.name ?? vf.url.split("/").pop()}
                      </Typography>
                    </Stack>
                    {isEditMode && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveVariantFileAt(idx)}
                        aria-label="remove"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Paper>
                );

                
              })}
            </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                  pt: 1,
                }}
              >
                {/* 수정 모드 토글 버튼 */}
                {!isEditMode ? (
                  <Button variant="contained" onClick={() => setIsEditMode(true)}>
                    수정
                  </Button>
                ) :
                  <Button variant="contained" onClick={() => setIsEditMode(false)}>
                    수정 취소
                  </Button>
                }
                <Button variant="outlined" onClick={handleCancel}>
                  목록
                </Button>
                {isEditMode ? (
                  <Button variant="contained" onClick={handleUpdate}>
                    저장
                  </Button>
                ) :
                  <Button
                    variant="outlined"
                    sx={{
                      color: 'red',         // 텍스트 색상
                      borderColor: 'red',   // 테두리 색상
                      '&:hover': {
                        borderColor: 'darkred',
                        backgroundColor: 'rgba(255,0,0,0.04)', // hover 시 살짝 붉은 배경
                      },
                    }}
                    onClick={handleDelete}
                  >
                  삭제
                </Button>
                }
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}