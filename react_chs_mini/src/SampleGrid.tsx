import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DataGrid} from '@mui/x-data-grid';
import type { GridRowSelectionModel } from '@mui/x-data-grid';
import { koKR } from "@mui/x-data-grid/locales";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// 실습 1 시작
import { useQuery } from "@tanstack/react-query";
import api from "./api/axiosInstance";
import PokemonDetailModal from "./PokemonDetailModal";

import SampleSwal from "./SampleSwal";

import * as React from 'react';
// 실습 1 끝

import { useMutation } from "@tanstack/react-query";
import RandomSpinner from "./Spinners";

// Row 타입 정의
interface RowData {
  id: number;
  firstName: string | null;
  lastName: string | null;
  age: number | null;
  gross?: number;
  costs?: number;
  taxRate?: number;
}

// 샘플 데이터
const rows = [
  {
    id: 1,
    firstName: "Jon",
    lastName: "Snow",
    age: 14,
    gross: 100000,
    costs: 80000,
    taxRate: 0.2,
  },
  {
    id: 2,
    firstName: "Cersei",
    lastName: "Lannister",
    age: 31,
    gross: 150000,
    costs: 120000,
    taxRate: 0.25,
  },
  {
    id: 3,
    firstName: "Jaime",
    lastName: "Lannister",
    age: 31,
    gross: 130000,
    costs: 100000,
    taxRate: 0.22,
  },
  {
    id: 4,
    firstName: "Arya",
    lastName: "Stark",
    age: 11,
    gross: 90000,
    costs: 70000,
    taxRate: 0.18,
  },
  {
    id: 5,
    firstName: "Daenerys",
    lastName: "Targaryen",
    age: null,
    gross: 200000,
    costs: 150000,
    taxRate: 0.3,
  },
  {
    id: 6,
    firstName: null,
    lastName: "Melisandre",
    age: 150,
    gross: 110000,
    costs: 90000,
    taxRate: 0.21,
  },
  {
    id: 7,
    firstName: "Ferrara",
    lastName: "Clifford",
    age: 44,
    gross: 140000,
    costs: 110000,
    taxRate: 0.24,
  },
  {
    id: 8,
    firstName: "Rossini",
    lastName: "Frances",
    age: 36,
    gross: 125000,
    costs: 100000,
    taxRate: 0.23,
  },
  {
    id: 9,
    firstName: "Harvey",
    lastName: "Roxie",
    age: 65,
    gross: 160000,
    costs: 120000,
    taxRate: 0.26,
  },
  {
    id: 10,
    firstName: "Tyrion",
    lastName: "Lannister",
    age: 38,
    gross: 135000,
    costs: 95000,
    taxRate: 0.22,
  },
  {
    id: 11,
    firstName: "Sansa",
    lastName: "Stark",
    age: 30,
    gross: 145000,
    costs: 105000,
    taxRate: 0.23,
  },
  {
    id: 12,
    firstName: "Bran",
    lastName: "Stark",
    age: 28,
    gross: 120000,
    costs: 90000,
    taxRate: 0.2,
  },
  {
    id: 13,
    firstName: "Joffrey",
    lastName: "Baratheon",
    age: 20,
    gross: 110000,
    costs: 80000,
    taxRate: 0.18,
  },
  {
    id: 14,
    firstName: "Margaery",
    lastName: "Tyrell",
    age: 26,
    gross: 130000,
    costs: 100000,
    taxRate: 0.21,
  },
  {
    id: 15,
    firstName: "Samwell",
    lastName: "Tarly",
    age: 32,
    gross: 95000,
    costs: 70000,
    taxRate: 0.19,
  },
  {
    id: 16,
    firstName: "Gilly",
    lastName: "Tarly",
    age: 29,
    gross: 90000,
    costs: 65000,
    taxRate: 0.18,
  },
  {
    id: 17,
    firstName: "Petyr",
    lastName: "Baelish",
    age: 42,
    gross: 170000,
    costs: 130000,
    taxRate: 0.25,
  },
  {
    id: 18,
    firstName: "Varys",
    lastName: null,
    age: 45,
    gross: 150000,
    costs: 110000,
    taxRate: 0.23,
  },
  {
    id: 19,
    firstName: "Bronn",
    lastName: null,
    age: 35,
    gross: 125000,
    costs: 95000,
    taxRate: 0.22,
  },
  {
    id: 20,
    firstName: "Sandor",
    lastName: "Clegane",
    age: 40,
    gross: 140000,
    costs: 110000,
    taxRate: 0.24,
  },
  {
    id: 21,
    firstName: "Gregor",
    lastName: "Clegane",
    age: 43,
    gross: 180000,
    costs: 140000,
    taxRate: 0.28,
  },
  {
    id: 22,
    firstName: "Davos",
    lastName: "Seaworth",
    age: 50,
    gross: 130000,
    costs: 100000,
    taxRate: 0.21,
  },
  {
    id: 23,
    firstName: "Stannis",
    lastName: "Baratheon",
    age: 48,
    gross: 160000,
    costs: 125000,
    taxRate: 0.25,
  },
  {
    id: 24,
    firstName: "Renly",
    lastName: "Baratheon",
    age: 36,
    gross: 155000,
    costs: 120000,
    taxRate: 0.24,
  },
  {
    id: 25,
    firstName: "Ygritte",
    lastName: null,
    age: 25,
    gross: 95000,
    costs: 70000,
    taxRate: 0.2,
  },
];

// 컬럼 정의 (타입 안전)
const columns: GridColDef<RowData>[] = [
  {
    field: "id", // 컬럼 key
    headerName: "ID", // 컬럼 헤더 이름
    width: 90, // 컬럼 너비
  },
  {
    field: "firstName",
    headerName: "First Name",
    width: 150,
    editable: true, // true면 셀 더블클릭 후 수정 가능
    renderCell: (params: GridRenderCellParams<RowData>) => {
      const id = params.row.id;
      const label = params.value ?? "";
      const url = `/profile/${id}`; // 원하는 URL 패턴으로 변경하세요
      return (
        <a href={url} style={{ color: "#1976d2", textDecoration: "none" }}>
          {label}
        </a>
      );
    },
  },
  {
    field: "lastName",
    headerName: "Last Name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number", // 숫자 타입
    width: 110,
    editable: true,
  },
  {
    field: "fullName",
    headerName: "Full Name",
    sortable: false, // false면 컬럼 정렬 불가
    width: 160,
    valueGetter: (value, row) => {
      // console.log(value, row);
      // params.row에서 데이터를 가져와 fullName 생성
      return `${row.firstName || ""} ${row.lastName || ""}`;
    },
  },
  {
    field: "taxRate",
    valueGetter: (value) => {
      if (!value) {
        return value;
      }
      return value * 100;
    },
  },
  {
    field: "profit",
    valueGetter: (value, row) => {
      // console.log(value, row);
      if (!row.gross || !row.costs) {
        return null;
      }
      return row.gross - row.costs;
    },
  },
];

export default function DataGridDemo() {
  // 실습 7 시작
  const navigate = useNavigate();
  // 실습 7 끝
  // selectionModel을 항상 배열로 관리
  // const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);

  // 체크박스 선택 변경 이벤트 — selectionModel 그대로 배열로 set
  // const handleSelectionChange = (newSelection: GridRowId[]) => {
  //   setSelectionModel(newSelection);
  // };

  // 로딩 시 스피너 사용 관련 state
  // const [loading, setLoading] = useState(true);

  // 실습 2 시작
  // pokemonList 호출 :  axios + react-query
  const { data: pokeData, isLoading, isFetching, error } = useQuery({
    queryKey: ["pokemonList"],
    queryFn: async () => {
      // setLoading(true);
      const res = await api.get("https://pokeapi.co/api/v2/pokemon?limit=30");
      console.log("res.data : ", res.data);
      // setLoading(false);
      return res.data as { count: number; results: { name: string; url: string }[] };
    },
  });

  // 서버에서 가져온 포켓몬 데이터를 그리드용 행 데이터로 변환한다.
  // 만약 pokeData가 없으면 기존의 static rows 데이터를 사용한다.
  const gridRows: RowData[] = pokeData?.results
    ? pokeData.results.map((p, i) => ({
        id: i + 1,
        firstName: p.name,
        lastName: p.name + i,
        age: i + Math.random() * 10,
        taxRate: i + Math.random() * 10,
        gross: i + Math.random() * 10,
        costs: i + Math.random() * 10,
      }))
    : rows;
  // 실습 2 끝

  // 실습 9 시작
  // 1. useMutation 훅 정의
  const deletePokemonMutation = useMutation({
    mutationFn: async (selectedIds : Array<string | number>) => {
      console.log("전송된 pokemonIds :", selectedIds);
      // API DELETE 요청 실행
      const res = await api.delete("/pokemon/deletePokemons", {
      data: selectedIds, // 배열을 body에 담아 전송
    });
      return res.data;
    },
    onSuccess: (data) => {
      console.log("서버 응답:", data);
      SampleSwal.fire({
        title: "삭제되었습니다.", 
        // text: "text 속성 ",
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

  // 버튼 클릭 시 선택된 row id 전송 (DataGrid props 없이 DOM에서 선택된 항목 추출)
  const [rowSelectionModel, setRowSelectionModel] =
  React.useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });

  // 그리드 체크박스 선택 후 삭제 버튼 클릭 시 핸들러
  const handleShowSelectedIds = () => {
    console.log(rowSelectionModel.ids);
    const selectedIds = Array.from(rowSelectionModel.ids).map((id) => Number(id));
    console.log("selectedIds : ",selectedIds);
    SampleSwal.fire({
      title: "선택된 데이터 목록을 삭제하시겠습니까?",
      text: selectedIds.join(", "),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "예",
      cancelButtonText: "아니오",
    }).then((result) => {
      if (result.isConfirmed) {


        // React Query로 전송 (기존 axios.post 대신)
        deletePokemonMutation.mutate(selectedIds);
      } else {
        return;
      }
    });
  };
  // 실습 9 끝

  // 실습 4 시작
  // 상세조회 상태
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);

  //실습 3 시작 
  //로딩 / 에러 표시 (선택사항: gridRows는 fetch 전에도 기존 rows로 대체됨) 
  if(isLoading || isFetching) return <RandomSpinner />;
  if(error) return <h1>404 ERROR</h1>;
  // 실습 3 끝


  

  // ID, FirstName 클릭 핸들러 포함한 컬럼 복사
  const columnsWithHandler = columns.map((col) => {
    // ID 클릭: 상세 페이지로 이동 (이 예제는 id 기반 경로 사용)
    if (col.field === "id") {
      return {
        ...col,
        renderCell: (params: GridRenderCellParams<RowData>) => {
          const label = params.value ?? "";
          const id = params.row.id ?? "";
          return (
            <Button
              variant="text"
              color="primary"
              sx={{ textTransform: "none", p: 0 }}
              onClick={() => {
                if (id) navigate(`/pokemon/${encodeURIComponent(Number(id))}`);
              }}
            >
              {label}
            </Button>
          );
        },
      } as GridColDef<RowData>;
    }

    // FirstName 클릭: 상세조회 모달 오픈
    if (col.field === "firstName") {
      return {
        ...col,
        renderCell: (params: GridRenderCellParams<RowData>) => {
          const label = params.value ?? "";
          return (
            <Button
              variant="text"
              color="primary"
              sx={{ textTransform: "none", p: 0 }}
              onClick={() => {
                setSelectedRow(params.row);
                setDetailOpen(true);
              }}
            >
              {label}
            </Button>
          );
        },
      } as GridColDef<RowData>;
    }
    // 실습 4 끝

    // 실습 8 시작
    if (col.field === "lastName") {
      return {
        ...col,
        renderCell: (params: GridRenderCellParams<RowData>) => {
          const label = params.value ?? "";
          const id = params.row.id ?? "";
          return (
            <Button
              variant="text"
              color="primary"
              sx={{ textTransform: "none", p: 0 }}
              onClick={() => {
                if (id) navigate(`/pokemon2/${encodeURIComponent(Number(id))}`); // App.tsx의 실습 7 경로로 이동
              }}
            >
              {label}
            </Button>
          );
        },
      } as GridColDef<RowData>;
    }
    // 실습 8 끝

    return col;

  });

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        {/* 선택 항목 전송 버튼 */}
        <Button
          variant="contained"
          color="info"
          onClick={handleShowSelectedIds}
          sx={{ mb : 1 }}
          disabled={rowSelectionModel.ids.size === 0}
        >
          선택 항목 삭제
        </Button>

        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 1 }}
          onClick={() => navigate("/pokemon/create")}
        >
          포켓몬 등록
        </Button>
      </div>

      
      <DataGrid
        //rows={rows} // rows 고정 데이터 사용 시
        rows={gridRows} // 데이터 배열 (fetch 결과 우선)
        //columns={columns} // 기존 firstName 클릭
        // 실습 5 시작 -- 기존 columns 속성 주석처리
        columns={columnsWithHandler} // firstName 클릭 핸들러 포함
        // 실습 5 끝
        pageSizeOptions={[10, 30, 50]} // 페이지네이션 옵션
        checkboxSelection // 각 행 왼쪽에 체크박스 표시
        disableRowSelectionOnClick // 행 클릭 시 선택 방지
        showToolbar // 기본 툴바 표시 (GridToolbar import 불필요)
        disableRowSelectionExcludeModel // Added for predictable 'include' model
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } }, // 초기 페이지당 행 수
        }}
        sx={{
          "& .MuiDataGrid-row:hover": { backgroundColor: "#f3f9ff" }, // 행 hover 스타일
        }}
        // 한글로 UI 표시: 필터, 검색, 내보내기, 페이지네이션 등
        localeText={koKR.components.MuiDataGrid.defaultProps.localeText}
        // Excel 내보내기 옵션 커스터마이징
        slotProps={{
          toolbar: {
            csvOptions: {
              fileName: '포켓몬리스트_'+Date.now().toString(),
              delimiter: ';',
              utf8WithBom: true,
            },
          },
        }}
        // loading={loading}
        
        // onRowSelectionModelChange={handleSelectionChange} // 체크박스 클릭 이벤트
      />
      {/* 실습 6 시작 */}
      {/* 상세조회 컴포넌트 */}
      <PokemonDetailModal open={detailOpen} onClose={() => setDetailOpen(false)} row={selectedRow} />
      {/* 실습 6 끝 */}
      {/* 실습 10 시작 */}
      {/* 로딩 시 스피너 실행 */}
      {/* {loading && (
        <RandomSpinner/>
      )} */}
      {/* 실습 10 끝 */}

    </Box>
  );
}
