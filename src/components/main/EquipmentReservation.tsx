import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

interface Equipment {
  id: string;
  name: string;
}

export default function EquipmentReservation({
  selectedEquipment,
}: {
  selectedEquipment: Equipment;
}) {
  const [reservedDates, setReservedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (selectedEquipment) {
      fetchReservedDates();
    }
  }, [selectedEquipment]);

  const fetchReservedDates = async () => {
    const { data, error } = await supabase
      .from("rental_requests")
      .select("start_date, end_date")
      .eq("equipment_id", selectedEquipment.id)
      .in("status", ["pending", "rented"]);

    if (error) {
      console.error("예약된 날짜 불러오기 오류:", error);
      return;
    }

    if (data) {
      // 기존 예약 기간을 날짜 배열로 변환
      const bookedDates = data.flatMap(({ start_date, end_date }) => {
        const start = new Date(start_date);
        const end = new Date(end_date);
        const dates = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
        return dates;
      });

      setReservedDates(bookedDates);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-lg font-bold">대여 가능 날짜 선택</p>
      <Calendar
        onChange={(date) => setSelectedDate(date as Date)}
        value={selectedDate}
        tileDisabled={({ date }) =>
          reservedDates.some(
            (reservedDate) =>
              date.toDateString() === reservedDate.toDateString(),
          )
        }
      />
      {selectedDate && (
        <p className="mt-2 text-blue-500">
          선택한 날짜: {selectedDate.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
