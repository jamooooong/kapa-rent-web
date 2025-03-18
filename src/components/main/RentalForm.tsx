import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

interface Equipment {
  id: string;
  name: string;
  status: string; // 장비 상태를 나타내는 필드 추가
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
  const [equipmentStatus, setEquipmentStatus] = useState(
    selectedEquipment.status,
  );

  // 장비의 대여 상태 확인
  useEffect(() => {
    const checkEquipmentStatus = async () => {
      const { data, error } = await supabase
        .from("rental_requests")
        .select("status")
        .eq("equipment_id", selectedEquipment.id)
        .in("status", ["pending", "rented"])
        .single();

      if (error) {
        console.error("장비 상태 확인 오류:", error);
        return;
      }

      if (data) {
        setEquipmentStatus("pending");
      } else {
        setEquipmentStatus("available");
      }
    };

    checkEquipmentStatus();
  }, [selectedEquipment.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitBtn = () => {
    alert("신청이 완료되었습니다.");
    window.location.reload();
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.studentId ||
      !formData.phone ||
      !formData.startDate ||
      !formData.endDate
    ) {
      setErrorMessage("모든 항목을 작성해야 합니다.");
      return false;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setErrorMessage("반납일은 대여일 이후여야 합니다.");
      return false;
    }
    if (
      new Date(formData.endDate).getTime() -
        new Date(formData.startDate).getTime() >
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

    // 대여 신청을 테이블에 추가
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

    // 장비의 상태를 'pending'으로 변경 - 테이블 이름을 'equipments'로 수정 - 테이블 이름을 'equipments'로 수정
    const { error: updateError } = await supabase
      .from("equipments") // 'equipment'에서 'equipments'로 수정)  // 'equipment'에서 'equipments'로 수정
      .update({ status: "pending" })
      .eq("id", selectedEquipment.id);

    if (updateError) {
      console.error("장비 상태 업데이트 오류:", updateError);
      setErrorMessage("장비 상태 업데이트 중 오류가 발생했습니다.");
      return;
    }
  };

  return (
    <div className="flex flex-col gap-4 border border-stone-600 bg-white p-4">
      <p className="text-2xl font-bold">장비대여 신청서</p>
      <div className="rounded-lg bg-amber-50 p-3">
        <p className="text-lg font-semibold">선택한 장비</p>
        <p className="text-amber-700">{selectedEquipment.name}</p>
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {equipmentStatus === "pending" && (
        <p className="text-red-500">이 장비는 대여 신청 중입니다.</p>
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
            disabled={equipmentStatus === "pending"}
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
            disabled={equipmentStatus === "pending"}
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
            disabled={equipmentStatus === "pending"}
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
            disabled={equipmentStatus === "pending"}
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
            disabled={equipmentStatus === "pending"}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-amber-600 px-4 py-2 text-xl font-medium text-white"
          disabled={equipmentStatus === "pending"}
          onClick={handleSubmitBtn}
        >
          신청서 제출
        </button>
      </form>
    </div>
  );
}
