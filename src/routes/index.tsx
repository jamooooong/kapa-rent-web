import { createFileRoute } from "@tanstack/react-router";
import RentalStatus from "../components/main/RentealStatus";
import RentalForm from "../components/main/RentalForm";
import AvailableEquipments from "../components/main/AvailableEquipments";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

// Equipment 타입 정의에 status 속성 추가
interface Equipment {
  id: string;
  name: string;
  status: string;
}

function RouteComponent() {
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null,
  );

  return (
    <div className="h-screen bg-gray-400 px-8 py-8">
      <div className="mx-auto flex max-w-xl flex-col gap-8 rounded-xl bg-white p-8">
        <p className="mx-auto text-3xl font-bold">KAPA 장비대여</p>
        <RentalStatus />
        <AvailableEquipments
          onSelect={(equipment) => {
            // equipment 객체가 status를 포함하는지 확인
            if (equipment && "status" in equipment) {
              setSelectedEquipment(equipment);
            } else {
              console.error("Invalid equipment selected");
            }
          }}
        />
        {selectedEquipment ? (
          <RentalForm selectedEquipment={selectedEquipment} />
        ) : (
          <p className="text-gray-500">장비를 선택하세요.</p>
        )}
      </div>
    </div>
  );
}
