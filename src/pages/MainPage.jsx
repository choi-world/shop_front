import { useEffect, useState } from "react";

export default function MainPage() {
  const [status, setStatus] = useState("로그인 상태 확인 중...");
  const [me, setMe] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setError(null);

        let res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/users/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (res.status === 401) {
          const refreshRes = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/api/auth/refresh`,
            {
              method: "POST",
              credentials: "include",
            }
          );

          // refresh 성공 → me 재시도
          if (refreshRes.ok) {
            res = await fetch(
              `${import.meta.env.VITE_SERVER_URL}/api/users/me`,
              {
                method: "GET",
                credentials: "include",
              }
            );
          }
        }

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP ${res.status}`);
        }

        const data = await res.json();
        setMe(data);
        setStatus("로그인됨");
      } catch (err) {
        setMe(null);
        setStatus("로그인 필요");
        setError(err?.message || "알 수 없는 에러");
      }
    };

    fetchMe();
  }, []);

  const handleLogout = async () => {
    try {
      setStatus("로그아웃 요청 중...");
      setError(null);

      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }

      setMe(null);
      setStatus("로그아웃됨");
    } catch (err) {
      setStatus("로그아웃 실패");
      setError(err?.message || "알 수 없는 에러");
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
