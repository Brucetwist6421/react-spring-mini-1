import { Box } from "@mui/material"; // 레이아웃 구성을 위한 Box
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import NavigationBar from "./layout/NavigationBar";
import MainDashboard from "./pages/dashboard/MainDashboard";
import NewPokemonDetailPage from "./pages/details/NewPokemonDetailPage";
import PokemonDetailPage from "./pages/details/PokemonDetailPage";
import PokemonCreatePage from "./pages/inserts/PokemonCreatePage";
import NewPokemonList from "./pages/lists/NewPokemonList";
import PokemonList from "./pages/lists/PokemonList";
import LmsDashboard from "./pages/lmsDashboard/LmsDashboard";
import LmsStudentManagement from "./pages/lmsDashboard/components/LmsStudentManagement";
import theme from "./theme";
import StockChartPage from "./pages/stock/StockChartPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        {/* 1. 전체 가로 배치를 위한 컨테이너 */}
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          {/* 2. 왼쪽 고정 사이드바 */}
          <NavigationBar />

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
                {/* 1. 구체적인 경로를 먼저 선언 */}
                <Route path="/pokemonList" element={<PokemonList />} />
                <Route path="/newPokemonList" element={<NewPokemonList />} />
                <Route path="/pokemon/create" element={<PokemonCreatePage />} />
                <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
                <Route path="/pokemon2/:id" element={<NewPokemonDetailPage />} />
                {/* 주식 예측 차트 페이지 추가 */}
                <Route path="/stock/prediction" element={<StockChartPage />} />
                {/* 2. 동적 파라미터는 가장 아래에 배치 */}
                <Route path="/" element={<MainDashboard />} />
                <Route path="/:pokemonName" element={<MainDashboard />} />

                <Route element={<ProtectedRoute />}>
                  {/* <Route path="/pokemon/create" element={<PokemonCreatePage />} /> */}
                  <Route path="/" element={<MainDashboard />} />
                  <Route path="/:pokemonName" element={<MainDashboard />} />
                  {/* 1. 학생 목록 페이지 (관리 버튼 클릭 시 도착지) */}
                  <Route path="/lms/management/:curSeq" element={<LmsStudentManagement />} />
                  {/* 2. 특정 학생 선택 시 상세 페이지 (목록은 그대로 있고 오른쪽 내용만 바뀜) */}
                  <Route path="/lms/management/:curSeq/student/:accountSeq" element={<LmsStudentManagement />} />
                  {/* LMS 대시보드 */}
                  <Route path="/lms/dashboard" element={<LmsDashboard />} />
                </Route>
              </Routes>
            </Box>

            {/* 하단 푸터 */}
            <Footer company="CHS Project 2026" />
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
