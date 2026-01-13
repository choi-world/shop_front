import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import KakaoCallback from "./pages/KakaoCallback";
import NaverCallback from "./pages/NaverCallback";
import MainPage from "./pages/MainPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/kakao/callback" element={<KakaoCallback />} />
      <Route path="/auth/naver/callback" element={<NaverCallback />} />
      <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
    </Routes>
  );
}
