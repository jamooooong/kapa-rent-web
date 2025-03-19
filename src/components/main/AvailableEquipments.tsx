import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

// Equipment 타입 수정
interface Equipment {
  id: string;
  name: string;
  status: string; // status 추가
}

// AvailableEquipments 컴포넌트
export default function AvailableEquipments({
  onSelect,
}: {
  onSelect: (equipment: Equipment) => void;
}) {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null); // 선택된 장비 ID 추적

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("equipments")
        .select("id, name, status") // status도 가져옴
        //.eq("status", "available")
        .order("name", { ascending: true });

      if (error) {
        console.error("장비 목록 불러오기 오류:", error);
        setError(error.message);
        return;
      }

      console.log("Fetched data:", data); // 데이터 확인용 로그
      setEquipments(data || []);
    } catch (err) {
      console.error("예상치 못한 오류:", err);
      setError("데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="text-onSurface flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg">
      <p className="text-base font-medium">대여 장비 선택</p>
      {equipments.length === 0 ? (
        <p className="text-onSurfaceVar">현재 대여 가능한 장비가 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {equipments.map((equipment) => (
            <li
              key={equipment.id}
              className={`border-stroke cursor-pointer rounded-lg border p-3 text-sm ${
                selectedId === equipment.id
                  ? "bg-onSurface text-white"
                  : "hover:bg-gray-200 active:bg-gray-300"
              }`}
              onClick={() => {
                setSelectedId(equipment.id);
                onSelect(equipment);
              }}
            >
              {equipment.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
