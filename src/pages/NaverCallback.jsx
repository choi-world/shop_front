import React, { useEffect, useMemo, useState } from "react";
import { verifyState } from "../lib/oauth.js";

function getQuery() {
  return new URLSearchParams(window.location.search);
}

export default function NaverCallback() {
  const [status, setStatus] = useState("처리 중...");
  const [detail, setDetail] = useState("");

  const q = useMemo(() => getQuery(), []);
  const code = q.get("code");
  const state = q.get("state");
  const error = q.get("error");
  const errorDesc = q.get("error_description");

  useEffect(() => {
    if (error) {
      setStatus("네이버 인증 실패");
      setDetail(`${error}${errorDesc ? `: ${errorDesc}` : ""}`);
      return;
    }
    if (!code) {
      setStatus("코드가 없습니다.");
      setDetail("인가 코드(code)가 전달되지 않았습니다.");
      return;
    }
    if (!state || !verifyState(state)) {
      setStatus("state 검증 실패");
      setDetail("CSRF 방지를 위한 state 값이 일치하지 않습니다.");
      return;
    }

    // ✅ 권장 흐름: code를 백엔드로 보내 토큰 교환
    // 예: POST /api/auth/naver { code, redirectUri }
    (async () => {
      try {
        setStatus("백엔드로 로그인 요청 중...");

        const res = await fetch("/api/auth/naver", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            redirectUri: import.meta.env.VITE_NAVER_REDIRECT_URI,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }

        setStatus("네이버 로그인 완료");
        setDetail("서버 세션/토큰 처리가 완료되었습니다(예시).");
      } catch (e) {
        setStatus("백엔드 처리 실패");
        setDetail(String(e?.message || e));
      }
    })();
  }, [code, state, error, errorDesc]);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h2 style={{ marginTop: 0 }}>네이버 콜백</h2>
      <p>
        <b>{status}</b>
      </p>
      {detail && (
        <pre style={{ background: "#f6f7fb", padding: 12, borderRadius: 12 }}>
          {detail}
        </pre>
      )}
      <hr />
      <div style={{ color: "#667085" }}>
        <div>code: {code ? `${code.slice(0, 8)}...` : "(없음)"}</div>
        <div>state: {state || "(없음)"}</div>
      </div>
    </div>
  );
}
