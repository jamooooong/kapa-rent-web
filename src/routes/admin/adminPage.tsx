import { createFileRoute } from "@tanstack/react-router";
import RentalRecord from "../../components/admin/RentalRecord";
import AddEquipment from "../../components/admin/AddEquipment";
import ManageEquipments from "../../components/admin/ManageEquipments";

export const Route = createFileRoute("/admin/adminPage")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <RentalRecord />
      <ManageEquipments />
      <AddEquipment />
    </div>
  );
}
