import { useEffect, useState } from "react";
import { getMe } from "../api/users";
import { logout } from "../api/auth";

export default function MainPage() {
  const [status, setStatus] = useState("로그인 상태 확인 중...");
  const [me, setMe] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getMe();

      if (res.ok) {
        const data = await res.json();
        setMe(data);
        setStatus("회원");
        return;
      }

      if (res.status === 401) {
        setMe(null);
        setStatus("게스트");
        return;
      }

      setStatus(`ERROR_${res.status}`);
    })();
  }, []);

  const handleLogout = async () => {
    try {
      setStatus("로그아웃 요청 중...");

      const res = await logout();

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }

      setMe(null);
      setStatus("게스트");
    } catch (err) {
      setStatus("로그아웃 실패");
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>메인 페이지</h1>
      <p style={{ marginTop: 0 }}>
        <strong>상태:</strong> {status}
      </p>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        {!me && (
          <button onClick={() => (window.location.href = "/login")}>
            로그인 페이지로
          </button>
        )}
        {me && (
          <>
            <button onClick={handleLogout}>로그아웃</button>
          </>
        )}
      </div>

      <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd" }}>
        <h3 style={{ marginTop: 0 }}>내 정보 (/api/users/me 응답)</h3>
        <pre style={{ margin: 0 }}>
          {me ? JSON.stringify(me, null, 2) : "없음"}
        </pre>
      </div>
    </div>
  );
}
