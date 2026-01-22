import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import PokemonCreatePage from "./PokemonCreatePage";
import PokemonDetailPage from "./PokemonDetailPage";
import PokemonDetailPage2 from "./PokemonDetailPage2";
import SampleGrid from "./SampleGrid";
import SampleTree from "./SampleTree";
import theme from "./theme";

function App() {
  // return (
  //   <ThemeProvider theme={theme}>
  //     <CssBaseline />
  //     {/* 실습 3 시작 */}
  //     <Header title="Header" />
  //     {/* 실습 3 끝 */}
  //     <div
  //       style={{
  //         display: "flex",
  //         alignItems: "flex-start",
  //         gap: 16,
  //         padding: 16,
  //       }}
  //     >
  //       {/* 실습 2 시작 */}
  //       {/* 왼쪽 사이드바 영역: 고정 너비 */}
  //       <div style={{ width: 320, flex: "0 0 320px" }}>
  //         <SampleTree />
  //       </div>
  //       {/* 실습 2 끝 */}

  //       {/* 실습 1 시작 */}
  //       {/* 오른쪽 메인 영역: 가변 */}
  //       <div style={{ flex: 1 }}>
  //         <h1> hello</h1>
  //         <SampleGrid />
  //       </div>
  //       {/* 실습 1 끝 */}
  //     </div>

  //     {/* 실습 4 시작 */}
  //     {/* Footer 추가 */}
  //     <Footer company="Footer" />
  //     {/* 실습 4 끝 */}
  //   </ThemeProvider>
  // );
  // 실습 5 시작
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Header title="Header" />
        <Routes>
          <Route
            path="/"
            element={
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: 16,
                }}
              >
                <div style={{ width: 320, flex: "0 0 320px" }}>
                  <SampleTree />
                </div>
                <div style={{ flex: 1 }}>
                  <SampleGrid />
                </div>
              </div>
            }
          />
          <Route
            path="/pokemon/:id"
            element={
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: 16,
                }}
              >
                <div style={{ width: 320, flex: "0 0 320px" }}>
                  <SampleTree />
                </div>
                <div style={{ flex: 1 }}>
                  <PokemonDetailPage />
                </div>
              </div>
            }
          />
          {/* 실습 6 시작 */}
          <Route path="/pokemon/create" element={
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: 16,
                }}
              >
                <div style={{ width: 320, flex: "0 0 320px" }}>
                  <SampleTree />
                </div>
                <div style={{ flex: 1 }}>
                  <PokemonCreatePage />
                </div>
              </div>
            } />
          {/* 실습 6 끝 */}
          {/* 실습 7 시작 */}
          <Route
            path="/pokemon2/:id"
            element={
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: 16,
                }}
              >
                <div style={{ width: 320, flex: "0 0 320px" }}>
                  <SampleTree />
                </div>
                <div style={{ flex: 1 }}>
                  <PokemonDetailPage2 />
                </div>
              </div>
            }
          />
          {/* 실습 7 끝 */}
        </Routes>
        {/* <Router2/> */}
        <Footer company="Footer" />
      </BrowserRouter>
    </ThemeProvider>
  );
  // 실습 5 끝
}

export default App;
