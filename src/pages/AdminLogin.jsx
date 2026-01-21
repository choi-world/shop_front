import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVER = import.meta.env.VITE_SERVER_URL;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ account: "", password: "" });
  const [status, setStatus] = useState("INIT");
  const [error, setError] = useState("");

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.account.trim()) return setError("아이디를 입력해 주세요.");
    if (!form.password) return setError("비밀번호를 입력해 주세요.");

    setStatus("SUBMITTING");

    try {
      const res = await fetch(`${SERVER}/api/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 쿠키 기반이면 유지
        body: JSON.stringify({
          account: form.account.trim(),
          password: form.password,
          type: "admin",
        }),
      });

      if (!res.ok) {
        const raw = await res.text();
        // Nest ValidationPipe면 message가 배열일 수 있어 파싱 시도
        let msg = raw || `HTTP ${res.status}`;
        try {
          const j = raw ? JSON.parse(raw) : null;
          if (j?.message)
            msg = Array.isArray(j.message) ? j.message.join("\n") : j.message;
        } catch {}
        throw new Error(msg);
      }

      setStatus("DONE");
      // 로그인 성공 후 관리자 홈으로
      navigate("/admin/main", { replace: true });
    } catch (err) {
      setStatus("FAIL");
      setError(String(err?.message || err));
    }
  }

  return (
    <div
      style={{
        padding: 32,
        maxWidth: 420,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ marginBottom: 8 }}>관리자 로그인</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        관리자 계정으로 로그인해 주세요.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <div style={{ display: "grid", gap: 12 }}>
          <label>
            아이디
            <input
              name="account"
              value={form.account}
              onChange={onChange}
              placeholder="admin"
              autoComplete="username"
              style={{
                display: "block",
                width: "100%",
                padding: 10,
                marginTop: 6,
                boxSizing: "border-box",
              }}
            />
          </label>

          <label>
            비밀번호
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{
                display: "block",
                width: "100%",
                padding: 10,
                marginTop: 6,
                boxSizing: "border-box",
              }}
            />
          </label>

          {error && (
            <div style={{ color: "crimson", whiteSpace: "pre-wrap" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "SUBMITTING"}
            style={{
              width: "100%",
              padding: "10px 12px",
              boxSizing: "border-box",
            }}
          >
            {status === "SUBMITTING" ? "로그인 중..." : "로그인"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            style={{
              width: "100%",
              padding: "10px 12px",
              boxSizing: "border-box",
              background: "transparent",
              border: "1px solid #ddd",
            }}
          >
            홈으로
          </button>
        </div>
      </form>
    </div>
  );
}
