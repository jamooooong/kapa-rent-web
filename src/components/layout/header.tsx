import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <div className="sticky top-0 flex w-full flex-row items-center justify-between bg-white px-4 py-4 shadow">
      <p>KAPA 장비대여 시스템</p>
      <Link to="/admin">
        <button className="rounded-lg bg-red-600 px-4 py-1 font-medium text-white hover:bg-red-900">
          관리자
        </button>
      </Link>
    </div>
  );
}
