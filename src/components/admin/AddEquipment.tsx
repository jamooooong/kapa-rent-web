import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

export default function AddEquipment() {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("장비 이름을 입력해주세요.");
      return;
    }

    const { error } = await supabase.from("equipments").insert([
      {
        name,
        status: "available", // 기본적으로 사용 가능한 상태로 추가
      },
    ]);

    if (error) {
      console.error("장비 추가 오류:", error);
      alert("장비 추가 중 오류가 발생했습니다.");
      return;
    }

    alert("장비가 추가되었습니다.");
    window.location.reload(); // 페이지 새로고침
  };

  return (
    <div className="text-onSurface flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg">
      <h2 className="text-xl font-bold">새 장비 추가</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 장비 이름 입력 */}
        <label className="block">
          <span className="text-sm font-medium">장비 이름</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[#6B7280] p-2"
            placeholder="장비 이름을 입력해주세요."
            required
          />
        </label>

        {/* 추가 버튼 */}
        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2 text-base font-medium text-white"
        >
          장비 추가
        </button>
      </form>
    </div>
  );
}
