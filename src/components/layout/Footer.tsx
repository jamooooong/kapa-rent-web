export default function Footer() {
  return (
    <div className="flex w-full flex-col items-center gap-2 bg-stone-200 px-4 py-10">
      <p className="text-onSurfaceVar text-sm font-medium">
        ©2025. KAPA. All rights reserved.
      </p>
      <a
        href="https://github.com/jamooooong"
        target="_blank"
        rel="noopener noreferrer"
      >
        <p className="text-onSurfaceVar text-sm font-medium hover:underline">
          jamoooong
        </p>
      </a>
    </div>
  );
}
