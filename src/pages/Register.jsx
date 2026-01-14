import { useLocation, useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import React, { useEffect, useMemo, useState } from "react";
import { register } from "../api/auth";

export default function Register() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const socialInfo = JSON.parse(state?.errorBody) ?? null;

  useEffect(() => {
    if (!socialInfo || !socialInfo.socialId == "")
      navigate("/", { replace: true });
  }, []);

  const [form, setForm] = useState({
    socialId: "",
    username: "",
    phone_number: "",
    birthday: "",
    email: "",
    gender: "",
  });

  const [clear, setClear] = useState(false);
  const [error, setError] = useState("");

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.username.trim()) return setError("닉네임을 입력해 주세요.");

    const payload = {
      socialId: socialInfo.info.socialId,
      type: socialInfo.info.type,
      username: form.username,
      phoneNumber: form.phone_number,
      birthday: form.birthday,
      email: form.email ? form.email : null,
      gender: form.gender ? true : false,
    };

    try {
      const res = await register(payload);

      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `HTTP ${res.status}`);
      }

      setClear(true);
      navigate("/"), { replace: true };
    } catch (e) {
      setClear(false);
      setError(String(e?.message || e));
    }
  }

  return (
    <div
      style={{
        padding: 32,
        maxWidth: 720,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ marginBottom: 8 }}>추가 회원가입</h1>

      <p style={{ marginTop: 0 }}>
        {"추가 정보를 입력해 가입을 완료해 주세요."}
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          padding: 12,
          marginTop: 12,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div>
          <strong>가입 방식:</strong> {socialInfo.type}
        </div>
        <div>
          <strong>이메일:</strong> {socialInfo.userEmail}
        </div>
        <div>
          <strong>소셜ID:</strong> {socialInfo.socialId}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <div style={{ display: "grid", gap: 12 }}>
          <label>
            닉네임(필수)
            <input
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="예: 홍길동"
              style={{
                display: "block",
                width: "100%",
                padding: 8,
                marginTop: 6,
                boxSizing: "border-box",
              }}
            />
          </label>

          <label>
            휴대폰(필수)
            <InputMask
              mask="999-9999-9999"
              maskChar={null}
              value={form.phone_number}
              onChange={onChange}
              placeholder="예: 010-1234-5678"
            >
              {(inputProps) => (
                <input
                  {...inputProps}
                  name="phone_number"
                  style={{
                    display: "block",
                    width: "100%",
                    padding: 8,
                    marginTop: 6,
                    boxSizing: "border-box",
                  }}
                />
              )}
            </InputMask>
          </label>

          <label>
            생일(필수)
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={onChange}
              max={new Date().toISOString().split("T")[0]}
              style={{
                display: "block",
                width: "100%",
                padding: 8,
                marginTop: 6,
                boxSizing: "border-box",
              }}
            />
          </label>

          <label>
            이메일(선택)
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="예: example@naver.com"
              style={{
                display: "block",
                width: "100%",
                padding: 8,
                marginTop: 6,
                boxSizing: "border-box",
              }}
            />
          </label>

          <label>
            성별
            <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="radio"
                  name="gender"
                  value="M"
                  checked={form.gender === "M"}
                  onChange={onChange}
                />
                남
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="radio"
                  name="gender"
                  value="F"
                  checked={form.gender === "F"}
                  onChange={onChange}
                />
                여
              </label>
            </div>
          </label>

          {/* <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={form.agreeTerms}
              onChange={onChange}
            />
            약관에 동의합니다(필수)
          </label> */}

          <button
            type="submit"
            disabled={status === "SUBMITTING"}
            style={{
              width: "100%",
              padding: "10px 12px",
              boxSizing: "border-box",
            }}
          >
            {status === "SUBMITTING" ? "가입 처리 중..." : "가입 완료"}
          </button>
        </div>
      </form>
    </div>
  );
}
