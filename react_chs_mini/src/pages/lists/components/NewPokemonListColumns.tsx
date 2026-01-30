import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import type { NewPokemonListType } from "../types/NewPokemonListType";
import { Box } from "@mui/material";

// 컬럼 정의 (타입 안전)
export const newPokemonListColumns: GridColDef<NewPokemonListType>[] = [
  {
    field: "id", // 컬럼 key
    headerName: "ID", // 컬럼 헤더 이름
    headerAlign: "center",
    width: 90, // 컬럼 너비
  },
  {
    field: "name",
    headerName: "포켓몬 이름",
    headerAlign: "center",
    width: 150,
    flex: 1,
    editable: true,
  },
  {  
    field: "description",
    headerName: "설명",
    headerAlign: "center",
    flex: 1,
    width: 110,
    editable: true,
  },
  {
    field: "mainImagePath",
    headerName: "썸네일",
    headerAlign: "center",
    width: 120,
    sortable: false,
    filterable: false,
    renderCell: (params: GridRenderCellParams<NewPokemonListType>) => {
      const fileName = params.value; // "86fa..._핑가.gif"
      
      if (!fileName) return "No Image";

      // 서버의 이미지 업로드 경로 주소 (IP 주소 확인 필요)
      const imageUrl = `http://168.107.51.143:8080/upload/${fileName}`;

      return (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={imageUrl}
            alt="pokemon"
            style={{
              width: "55px",
              height: "55px",
              borderRadius: "4px",
              objectFit: "cover",
              border: "1px solid #eee",
            }}
            // 이미지 로드 실패 시 대체 텍스트나 기본 이미지 설정
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/40?text=No";
            }}
          />
        </Box>
      );
    },
  },
];