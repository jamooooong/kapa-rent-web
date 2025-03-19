import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

interface Equipment {
  name: string;
}

interface RentalStatus {
  id: string;
  equipment: Equipment; // `equipment`는 객체 형태
  name: string;
  end_date: string;
}

export default function RentalStatus() {
  const [rentedEquipments, setRentedEquipments] = useState<RentalStatus[]>([]);

  useEffect(() => {
    fetchRentedEquipments();
  }, []);

  const fetchRentedEquipments = async () => {
    const { data, error } = await supabase
      .from("rental_requests")
      .select("id, name, end_date, equipment_id")
      .eq("status", "rented")
      .order("end_date", { ascending: true });

    if (error) {
      console.error("대여 현황 불러오기 오류:", error);
      return;
    }

    if (data) {
      // 각 대여 신청에 해당하는 장비의 정보를 가져오는 별도 쿼리 추가
      const equipmentPromises = data.map(async (item) => {
        const { data: equipmentData, error: equipmentError } = await supabase
          .from("equipments")
          .select("name")
          .eq("id", item.equipment_id)
          .single(); // single()을 사용하여 하나의 객체를 반환

        if (equipmentError) {
          console.error("장비 정보 불러오기 오류:", equipmentError);
          return null;
        }

        return {
          id: item.id,
          equipment: equipmentData, // 장비 이름을 포함한 객체
          name: item.name,
          end_date: item.end_date,
        };
      });

      const rentedEquipments = await Promise.all(equipmentPromises);
      setRentedEquipments(rentedEquipments.filter((item) => item !== null));
    }
  };

  return (
    <div className="text-onSurface flex flex-col gap-4 rounded-lg bg-white p-4 shadow-lg">
      <p className="text-base font-medium">장비대여 현황</p>
      {rentedEquipments.length === 0 ? (
        <p className="text-onSurfaceVar text-base">
          현재 대여 중인 장비가 없습니다.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {rentedEquipments.map((rental) => (
            <li
              key={rental.id}
              className="border-stroke rounded-lg border p-3 text-sm"
            >
              <div className="flex justify-between">
                <p className="text-onSurfaceVar">장비:</p>
                <p className="font-bold">{rental.equipment.name}</p>{" "}
              </div>

              <div className="flex justify-between">
                <p className="text-onSurfaceVar">대여자:</p>
                <p>{rental.name}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-onSurfaceVar">반납 예정일: </p>
                <p>{rental.end_date}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
