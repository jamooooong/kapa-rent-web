import { createFileRoute, Link } from "@tanstack/react-router";
import AddEquipment from "../../components/admin/AddEquipment";
import ManageEquipments from "../../components/admin/ManageEquipments";

export const Route = createFileRoute("/admin/manage")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="px-8 py-8">
      <div className="mx-auto flex max-w-xl flex-col gap-8">
        <Link to="/admin/adminPage">
          <button className="bg-onSurface mt-2 w-full cursor-pointer rounded-lg px-4 py-4 text-xl font-medium text-white hover:bg-stone-600 active:bg-stone-500">
            관리자 페이지로 이동
          </button>
        </Link>
        <ManageEquipments />
        <AddEquipment />
      </div>
    </div>
  );
}
