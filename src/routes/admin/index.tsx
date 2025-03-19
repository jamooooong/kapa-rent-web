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
      <div className="flex w-sm max-w-xl flex-col gap-4 rounded-lg bg-white p-4 shadow-lg">
        <p className="mb-8 text-2xl">비밀번호 입력</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-[#6B7280] p-2"
          placeholder="비밀번호를 입력하세요"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
        <button
          onClick={handleLogin}
          className="bg-onSurface w-full rounded-lg px-4 py-2 text-lg font-medium text-white hover:bg-stone-600 active:bg-stone-500"
        >
          입장하기
        </button>
      </div>
    </div>
  );
}
