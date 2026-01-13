import React, { useEffect, useMemo, useState } from "react";
import { verifyState } from "../lib/oauth.js";
import { useNavigate } from "react-router-dom";

function getQuery() {
  return new URLSearchParams(window.location.search);
}

export default function KakaoCallback() {
  const [status, setStatus] = useState("처리 중...");
  const [detail, setDetail] = useState("");
  const navigate = useNavigate();

  const q = useMemo(() => getQuery(), []);
  const code = q.get("code");
  const state = q.get("state");
  const error = q.get("error");
  const errorDesc = q.get("error_description");

  useEffect(() => {
    if (error) {
      setStatus("카카오 인증 실패");
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

    // 백엔드로 요청
    (async () => {
      try {
        setStatus("백엔드로 로그인 요청 중...");

        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "kakao",
              code,
              redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
            }),
            credentials: "include",
          }
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }

        setStatus("카카오 로그인 완료");
        setDetail("서버 세션/토큰 처리가 완료되었습니다(예시).");

        navigate("/", { replace: true });
      } catch (e) {
        setStatus("백엔드 처리 실패");
        setDetail(String(e?.message || e));
      }
    })();
  }, [code, state, error, errorDesc]);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h2 style={{ marginTop: 0 }}>카카오 콜백</h2>
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
