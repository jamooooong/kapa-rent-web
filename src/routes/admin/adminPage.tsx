import { createFileRoute, Link } from "@tanstack/react-router";
import RentalRecord from "../../components/admin/RentalRecord";

export const Route = createFileRoute("/admin/adminPage")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="px-8 py-8">
      <div className="mx-auto flex max-w-xl flex-col gap-8">
        <Link to="/admin/manage">
          <button className="bg-onSurface mt-2 w-full cursor-pointer rounded-lg px-4 py-4 text-xl font-medium text-white hover:bg-stone-600 active:bg-stone-500">
            장비관리 이동
          </button>
        </Link>
        <RentalRecord />
      </div>
    </div>
  );
}
