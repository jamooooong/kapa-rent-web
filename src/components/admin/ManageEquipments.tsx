import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

interface Equipment {
  id: string;
  name: string;
}

export default function ManageEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("equipments")
      .select("id, name");

    if (error) {
      console.error("장비 목록 불러오기 오류:", error);
      return;
    }

    setEquipments(data || []);
    setIsLoading(false);
  };

  const handleDelete = async (equipmentId: string) => {
    if (!confirm("정말로 이 장비를 삭제하시겠습니까?")) return;

    try {
      // 1. 해당 장비와 관련된 대여 신청 삭제
      const { error: rentalError } = await supabase
        .from("rental_requests")
        .delete()
        .eq("equipment_id", equipmentId);

      if (rentalError) {
        console.error("대여 신청 삭제 오류:", rentalError);
        alert("장비 삭제 중 오류가 발생했습니다.");
        return;
      }

      // 2. 장비 삭제
      const { error: equipmentError } = await supabase
        .from("equipments")
        .delete()
        .eq("id", equipmentId);

      if (equipmentError) {
        console.error("장비 삭제 오류:", equipmentError);
        alert("장비 삭제 중 오류가 발생했습니다.");
        return;
      }

      alert("장비가 삭제되었습니다.");
      fetchEquipments(); // 목록 새로고침
    } catch (error) {
      console.error("예상치 못한 오류:", error);
      alert("장비 삭제 중 문제가 발생했습니다.");
    }
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="text-onSurface flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg">
      <h2 className="mb-4 text-xl font-bold">장비 관리</h2>
      {equipments.length === 0 ? (
        <p className="text-gray-500">현재 등록된 장비가 없습니다.</p>
      ) : (
        <ul className="border-stroke rounded-lg border p-3 text-sm">
          {equipments.map((equipment) => (
            <li
              key={equipment.id}
              className="flex items-center justify-between"
            >
              <span className="text-lg">{equipment.name}</span>
              <button
                onClick={() => handleDelete(equipment.id)}
                className="rounded bg-red-600 px-4 py-1 text-white"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
