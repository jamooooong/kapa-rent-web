import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

interface RentalRequest {
  id: string;
  name: string;
  student_id: string;
  phone: string;
  start_date: string;
  end_date: string;
  equipment_id: string;
  status: string;
  equipments:
    | {
        // Supabase join 결과를 위한 필드
        name: string;
      }
    | { name: string }[];
  equipment_name?: string; // 매핑된 데이터를 위한 선택적 필드
}

function RouteComponent() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);

  useEffect(() => {
    if (authenticated) {
      fetchRentalRequests();
    }
  }, [authenticated]);

  const fetchRentalRequests = async () => {
    const { data, error } = await supabase
      .from("rental_requests")
      .select(
        "id, name, student_id, phone, start_date, end_date, equipment_id, status, equipments(name)",
      )
      .in("status", ["rented", "pending"]) // rented 상태 포함
      .order("start_date", { ascending: true });

    if (error) {
      console.error("대여 신청 목록 불러오기 오류:", error);
      return;
    }

    if (data) {
      setRentalRequests(
        data.map((item) => ({
          ...item,
          equipment_name: Array.isArray(item.equipments)
            ? item.equipments[0]?.name
            : "equipments" in item &&
                item.equipments &&
                typeof item.equipments === "object" &&
                "name" in item.equipments
              ? (item.equipments as { name: string }).name
              : undefined,
        })),
      );
    }
  };

  const handleApprove = async (id: string, equipment_id: string) => {
    const { error } = await supabase
      .from("rental_requests")
      .update({ status: "rented" })
      .eq("id", id);

    if (error) {
      console.error("대여 완료 처리 오류:", error);
      alert("처리 중 오류가 발생했습니다.");
      return;
    }

    // 대여 가능한 장비 목록에서 제거
    await supabase
      .from("equipments")
      .update({ status: "rented" })
      .eq("id", equipment_id);

    alert("대여 완료 처리되었습니다.");
    fetchRentalRequests(); // 목록 갱신
  };

  const handleReturn = async (id: string, equipment_id: string) => {
    // rental_requests 테이블에서 상태를 "returned"로 변경
    const { error: updateError } = await supabase
      .from("rental_requests")
      .update({ status: "returned" })
      .eq("id", id);

    if (updateError) {
      console.error("반납 완료 처리 오류:", updateError);
      alert("처리 중 오류가 발생했습니다.");
      return;
    }

    // equipments 테이블에서 해당 장비를 다시 대여 가능 상태로 변경
    const { error: equipmentError } = await supabase
      .from("equipments")
      .update({ status: "available" })
      .eq("id", equipment_id);

    if (equipmentError) {
      console.error("장비 상태 업데이트 오류:", equipmentError);
      alert("장비 상태 업데이트 중 오류가 발생했습니다.");
      return;
    }

    alert("반납 완료 처리되었습니다.");
    fetchRentalRequests(); // 목록 갱신
  };

  return (
    <div className="p-6">
      {!authenticated ? (
        <div className="mx-auto flex max-w-sm flex-col gap-4 border p-6">
          <p className="text-xl font-bold">관리자 비밀번호 입력</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border p-2"
          />
          <button
            onClick={() => {
              if (password === "kapalove") {
                setAuthenticated(true);
              } else {
                alert("비밀번호가 틀렸습니다!");
              }
            }}
            className="rounded bg-gray-700 px-4 py-2 text-white"
          >
            로그인
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-2xl font-bold">장비 대여 신청 목록</p>
          {rentalRequests.length === 0 ? (
            <p className="text-gray-500">현재 대여 신청이 없습니다.</p>
          ) : (
            <ul className="space-y-4">
              {rentalRequests.map((request) => (
                <li key={request.id} className="rounded border p-4">
                  <p className="text-lg font-bold">{request.equipment_name}</p>
                  <p>
                    신청자: {request.name} ({request.student_id})
                  </p>
                  <p>전화번호: {request.phone}</p>
                  <p>
                    대여 기간: {request.start_date} ~ {request.end_date}
                  </p>
                  {request.status === "rented" ? (
                    <button
                      onClick={() =>
                        handleReturn(request.id, request.equipment_id)
                      }
                      className="mt-2 rounded bg-red-600 px-4 py-2 text-white"
                    >
                      반납 완료
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleApprove(request.id, request.equipment_id)
                      }
                      className="mt-2 rounded bg-green-600 px-4 py-2 text-white"
                    >
                      대여 완료
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
