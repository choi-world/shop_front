import React from "react";
import { getKakaoAuthUrl, getNaverAuthUrl } from "../lib/oauth.js";

const containerStyle = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#f6f7fb",
  padding: 24,
};

const cardStyle = {
  width: "min(520px, 100%)",
  background: "white",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const titleStyle = { margin: 0, fontSize: 22, fontWeight: 800 };
const subStyle = { marginTop: 8, color: "#667085", lineHeight: 1.5 };

const btnBase = {
  width: "100%",
  border: "none",
  borderRadius: 12,
  padding: "14px 16px",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
};

const kakaoBtn = { ...btnBase, background: "#FEE500", color: "#191600" };
const naverBtn = { ...btnBase, background: "#03C75A", color: "white" };

const divider = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  color: "#98A2B3",
  margin: "18px 0",
  fontSize: 13,
};
const line = { height: 1, flex: 1, background: "#EAECF0" };

function IconKakao() {
  return (
    <span
      aria-hidden
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        background: "rgba(25, 22, 0, 0.12)",
        display: "inline-grid",
        placeItems: "center",
        fontSize: 12,
      }}
    >
      K
    </span>
  );
}

function IconNaver() {
  return (
    <span
      aria-hidden
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        background: "rgba(255,255,255,0.18)",
        display: "inline-grid",
        placeItems: "center",
        fontSize: 12,
      }}
    >
      N
    </span>
  );
}

export default function Login() {
  const onKakao = () => {
    window.location.href = getKakaoAuthUrl();
  };

  const onNaver = () => {
    window.location.href = getNaverAuthUrl();
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>소셜 로그인</h1>
        <p style={subStyle}>
          카카오 또는 네이버 계정으로 로그인할 수 있습니다.
          <br />
          버튼을 누르면 해당 서비스 인증 화면으로 이동합니다.
        </p>

        <div style={{ marginTop: 18, display: "grid", gap: 12 }}>
          <button type="button" style={kakaoBtn} onClick={onKakao}>
            <IconKakao />
            카카오로 로그인
          </button>

          <button type="button" style={naverBtn} onClick={onNaver}>
            <IconNaver />
            네이버로 로그인
          </button>
        </div>

        <div style={divider}>
          <span style={line} />
          <span>안내</span>
          <span style={line} />
        </div>

        <ul
          style={{
            margin: 0,
            paddingLeft: 18,
            color: "#667085",
            lineHeight: 1.6,
          }}
        >
          <li>Redirect URI가 콘솔 설정과 일치해야 합니다.</li>
          <li>
            로그인 완료 처리를 위해서는 백엔드에서 토큰 교환을 권장합니다.
          </li>
        </ul>
      </div>
    </div>
  );
}
