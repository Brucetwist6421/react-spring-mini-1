import { useEffect, useState } from "react";

/**
 현재 URL(hash)에 따라 어떤 화면을 보여줄지 결정하는 타입
 */
type Route = "home" | "about" | "profile";

/**
 메인 App 컴포넌트
 */
const Router2 = () => {
  /**
   1. 현재 경로를 state로 관리
   URL과 UI를 동기화하기 위한 핵심 state
   */
  const [route, setRoute] = useState<Route>("home");

  /**
   2.URL(hash)이 바뀔 때 실행되는 로직
   */
  useEffect(() => {
    const handleHashChange = () => {
      /**
       window.location.hash 예시
       "#/home" → "/home"
       */
      const hash = window.location.hash.replace("#/", "");

      /**
       주소에 따라 route 결정
       */
      if (hash === "about" || hash === "profile") {
        setRoute(hash);
      } else {
        setRoute("home");
      }
    };

    /**
     최초 진입 시 한 번 실행
     */
    handleHashChange();

    /**
     hash 변경 감지
     */
    window.addEventListener("hashchange", handleHashChange);

    /**
     cleanup
     */
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  /**
   3️⃣ route 값에 따라 렌더링할 컴포넌트 선택
   */
  const renderPage = () => {
    switch (route) {
      case "home":
        return <Home />;
      case "about":
        return <About />;
      case "profile":
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>라이브러리 없는 라우팅</h1>

      {/*네비게이션 */}
      <nav style={{ marginBottom: 20 }}>
        <a href="#/home">Home</a> |{" "}
        <a href="#/about">About</a> |{" "}
        <a href="#/profile">Profile</a>
      </nav>

      {/*현재 URL 표시 */}
      <p>
        현재 URL: <strong>{window.location.hash}</strong>
      </p>

      <hr />

      {/*페이지 렌더링 */}
      {renderPage()}
    </div>
  );
};

/*===============================
   페이지 컴포넌트들
================================ */

const Home = () => (
  <div>
    <h2>Home</h2>
    <p>홈 화면입니다.</p>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
    <p>이 앱은 라우팅 개념을 설명하기 위한 예제입니다.</p>
  </div>
);

const Profile = () => (
  <div>
    <h2>👤 Profile</h2>
    <p>사용자 프로필 화면입니다.</p>
  </div>
);

export default Router2;
