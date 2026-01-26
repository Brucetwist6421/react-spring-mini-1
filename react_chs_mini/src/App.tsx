import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material"; // 레이아웃 구성을 위한 Box
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import SampleGrid from "./pages/grid/PokemonList";
import PokemonCreatePage from "./pages/PokemonCreatePage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import PokemonDetailPage2 from "./pages/PokemonDetailPage2";
import theme from "./theme";
import { AppSidebar } from "./layout/Sidebar"; // 생성하신 사이드바 임포트

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {/* 1. 전체 가로 배치를 위한 컨테이너 */}
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          {/* 2. 왼쪽 고정 사이드바 */}
          <AppSidebar />

          {/* 3. 오른쪽 가변 컨텐츠 영역 */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0, // Flex 자식 요소의 오버플로우 방지
            }}
          >
            {/* 상단 헤더 */}
            <Header title="Pokemon Manager" />

            {/* 메인 본문: 페이지 이동 시 여기만 바뀝니다 */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Routes>
                <Route path="/" element={<SampleGrid />} />
                <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
                <Route path="/pokemon/create" element={<PokemonCreatePage />} />
                <Route path="/pokemon2/:id" element={<PokemonDetailPage2 />} />
              </Routes>
            </Box>

            {/* 하단 푸터 */}
            <Footer company="Project 2026" />
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
