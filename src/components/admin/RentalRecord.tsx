import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

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
        name: string;
      }
    | { name: string }[];
  equipment_name?: string;
}

export default function RentalRecord() {
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);

  useEffect(() => {
    fetchRentalRequests();
  }, []);

  const fetchRentalRequests = async () => {
    const { data, error } = await supabase
      .from("rental_requests")
      .select(
        "id, name, student_id, phone, start_date, end_date, equipment_id, status, equipments(name)",
      )
      .in("status", ["rented", "pending"])
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

    await supabase
      .from("equipments")
      .update({ status: "rented" })
      .eq("id", equipment_id);

    alert("대여 완료 처리되었습니다.");
    fetchRentalRequests();
  };

  const handleReturn = async (id: string, equipment_id: string) => {
    const { error: updateError } = await supabase
      .from("rental_requests")
      .update({ status: "returned" })
      .eq("id", id);

    if (updateError) {
      console.error("반납 완료 처리 오류:", updateError);
      alert("처리 중 오류가 발생했습니다.");
      return;
    }

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
    fetchRentalRequests();
  };

  return (
    <div className="text-onSurface flex flex-col rounded-lg bg-white p-4 shadow-lg">
      <div>
        <p className="mb-4 text-base font-medium">장비 대여 신청 목록</p>
        {rentalRequests.length === 0 ? (
          <p className="text-onSurfaceVar text-base">
            현재 대여 신청이 없습니다.
          </p>
        ) : (
          <ul className="space-y-4">
            {rentalRequests.map((request) => (
              <li
                key={request.id}
                className="border-stroke rounded-lg border p-3 text-base"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-lg font-bold">{request.equipment_name}</p>
                  {request.status === "rented" ? (
                    <p className="text-lg font-medium text-red-600">대여중</p>
                  ) : (
                    <p className="text-lg font-medium text-green-600">
                      대여신청
                    </p>
                  )}
                </div>

                <p>신청자: {request.name}</p>
                <p>학 번: {request.student_id}</p>
                <p>전화번호: {request.phone}</p>
                <p>
                  대여 기간: {request.start_date} ~ {request.end_date}
                </p>
                <div className="flex w-full justify-end">
                  {request.status === "rented" ? (
                    <button
                      onClick={() =>
                        handleReturn(request.id, request.equipment_id)
                      }
                      className="text-bold mt-2 rounded bg-red-600 px-4 py-2 text-lg text-white hover:bg-red-800"
                    >
                      반납 처리
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        handleApprove(request.id, request.equipment_id)
                      }
                      className="text-bold mt-2 rounded bg-green-600 px-4 py-2 text-lg text-white hover:bg-green-800"
                    >
                      대여 처리
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
