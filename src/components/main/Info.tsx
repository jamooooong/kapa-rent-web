export default function Info() {
  return (
    <div className="text-onSurface flex flex-col gap-2 rounded-lg bg-white p-4 shadow-lg">
      <p>
        한 명이 복수의 대여가 가능하지만, 각 대여품 마다 신청서를 작성해주어야
        합니다.
      </p>
      <p>
        대여는 최대 <span className="font-medium text-red-600">2박 3일</span>{" "}
        가능합니다. (빌리는 날 포함)
      </p>
      <p>신청 후, 기술부장(이재명)에게 카톡시 더 빠른 처리가 가능합니다.</p>
    </div>
  );
}
