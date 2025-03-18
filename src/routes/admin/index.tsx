import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const pw = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleLogin = () => {
    if (password === pw) {
      navigate({ to: "/admin/adminPage" });
    } else {
      alert("비밀번호가 틀렸습니다!");
      setPassword("");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-fit space-y-4 rounded-xl border border-stone-600 bg-white p-6">
        <p className="mb-8 text-2xl">비밀번호 입력</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded border p-2 text-base"
          placeholder="비밀번호를 입력하세요"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
        <button
          onClick={handleLogin}
          className="w-full rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
        >
          입장하기
        </button>
      </div>
    </div>
  );
}
