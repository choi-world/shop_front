import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVER = import.meta.env.VITE_SERVER_URL;

export default function AdminMainPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    product_name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    status: "ACTIVE",
    image_url: "",
  });

  useEffect(() => {
    let alive = true;

    async function checkMe() {
      try {
        const res = await fetch(`${SERVER}/api/users/me`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401) {
          if (!alive) return;
          navigate("/admin", { replace: true });
          return;
        }

        if (res.status === 403) {
          if (!alive) return;
          navigate("/admin", { replace: true });
          return;
        }

        if (!res.ok) {
          const raw = await res.text();
          throw new Error(raw || `HTTP ${res.status}`);
        }

        const me = await res.json();
        const role = me?.info.role; // 서버 응답 키에 맞게 수정

        if (role !== "ADMIN") {
          if (!alive) return;
          navigate("/admin", { replace: true });
          return;
        }

        if (!alive) return;

      } catch (err) {
        if (!alive) return;
      }
    }

    checkMe();
    return () => {
      alive = false;
    };
  }, []);

  const [error, setError] = useState("");
  const [status, setStatus] = useState("INIT");

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.product_name.trim()) return setError("상품명을 입력해 주세요.");
    if (!form.price) return setError("가격을 입력해 주세요.");
    if (!form.stock) return setError("재고를 입력해 주세요.");
    if (!form.category.trim()) return setError("카테고리를 입력해 주세요.");

    setStatus("SUBMITTING");

    try {
      const res = await fetch(`${SERVER}/api/master/register/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "등록 실패");
      }

      alert("상품이 등록되었습니다.");
      setStatus("DONE");
      setForm({
        product_name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        status: "ACTIVE",
        image_url: "",
      });
    } catch (err) {
      setStatus("FAIL");
      setError(String(err.message || err));
    }
  }

  return (
    <div
      style={{
        padding: 32,
        maxWidth: 600,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ marginBottom: 8 }}>상품 등록</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        관리자 상품 등록 화면
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
        <div style={{ display: "grid", gap: 14 }}>
          <label>
            상품명
            <input
              name="product_name"
              value={form.product_name}
              onChange={onChange}
              style={inputStyle}
            />
          </label>

          <label>
            설명
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={4}
              style={textareaStyle}
            />
          </label>

          <label>
            가격
            <input
              name="price"
              value={form.price}
              onChange={onChange}
              inputMode="numeric"
              style={inputStyle}
            />
          </label>

          <label>
            재고
            <input
              name="stock"
              value={form.stock}
              onChange={onChange}
              inputMode="numeric"
              style={inputStyle}
            />
          </label>

          <label>
            카테고리
            <input
              name="category"
              value={form.category}
              onChange={onChange}
              style={inputStyle}
            />
          </label>

          <label>
            상태
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              style={inputStyle}
            >
              <option value="ACTIVE">판매중</option>
              <option value="INACTIVE">판매중지</option>
              <option value="SOLD_OUT">품절</option>
            </select>
          </label>

          <label>
            이미지 URL
            <input
              name="image_url"
              value={form.image_url}
              onChange={onChange}
              style={inputStyle}
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
            {status === "SUBMITTING" ? "등록 중..." : "상품 등록"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: 10,
  marginTop: 6,
  boxSizing: "border-box",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
};
