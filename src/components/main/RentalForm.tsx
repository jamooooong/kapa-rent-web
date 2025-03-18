import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

interface Equipment {
  id: string;
  name: string;
}

export default function RentalForm({
  selectedEquipment,
}: {
  selectedEquipment: Equipment;
}) {
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    phone: "",
    startDate: "",
    endDate: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [disabledDates, setDisabledDates] = useState<
    { start: string; end: string }[]
  >([]);

  useEffect(() => {
    const fetchDisabledDates = async () => {
      const { data, error } = await supabase
        .from("rental_requests")
        .select("start_date, end_date")
        .eq("equipment_id", selectedEquipment.id)
        .in("status", ["pending", "rented"]);

      if (error) {
        console.error("대여 일정 불러오기 오류:", error);
        return;
      }

      if (data) {
        setDisabledDates(
          data.map((rental) => ({
            start: rental.start_date,
            end: rental.end_date,
          })),
        );
      }
    };

    fetchDisabledDates();
  }, [selectedEquipment.id]);

  const isDateAvailable = (startDate: string, endDate: string) => {
    return !disabledDates.some(
      ({ start, end }) =>
        new Date(startDate) <= new Date(end) &&
        new Date(endDate) >= new Date(start),
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { startDate, endDate } = formData;

    if (!isDateAvailable(startDate, endDate)) {
      setErrorMessage("선택한 기간에 이미 예약이 있습니다.");
      return false;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setErrorMessage("반납일은 대여일 이후여야 합니다.");
      return false;
    }

    if (
      new Date(endDate).getTime() - new Date(startDate).getTime() >
      7 * 24 * 60 * 60 * 1000
    ) {
      setErrorMessage("반납일은 최대 7일 이내여야 합니다.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { name, studentId, phone, startDate, endDate } = formData;

    const { error } = await supabase.from("rental_requests").insert([
      {
        equipment_id: selectedEquipment.id,
        name,
        student_id: studentId,
        phone,
        start_date: startDate,
        end_date: endDate,
        status: "pending",
      },
    ]);

    if (error) {
      console.error("대여 신청 오류:", error);
      setErrorMessage("신청 중 오류가 발생했습니다.");
      return;
    }

    alert("신청이 완료되었습니다.");
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-4 border border-stone-600 bg-white p-4">
      <p className="text-2xl font-bold">장비대여 신청서</p>
      <div className="rounded-lg bg-amber-50 p-3">
        <p className="text-lg font-semibold">선택한 장비</p>
        <p className="text-amber-700">{selectedEquipment.name}</p>
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {disabledDates.length > 0 && (
        <div className="bg-red-100 p-2">
          <p className="font-semibold text-red-600">예약된 기간:</p>
          {disabledDates.map(({ start, end }, index) => (
            <p key={index} className="text-sm">
              {start} ~ {end}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            이름
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="studentId" className="block text-sm font-medium">
            학번
          </label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            전화번호
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium">
            대여 시작일
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium">
            반납일
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-amber-600 px-4 py-2 text-xl font-medium text-white"
        >
          신청서 제출
        </button>
      </form>
    </div>
  );
}
