import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <div className="bg-onSurface sticky top-0 flex w-full flex-row items-center justify-between px-4 py-4 shadow">
      <div></div>
      <p className="text-xl font-bold text-white">KAPA 장비대여</p>
      <Link to="/admin">
        <button className="text-onSurface rounded-lg bg-white px-4 py-1 font-medium hover:bg-stone-200">
          관리자
        </button>
      </Link>
    </div>
  );
}
