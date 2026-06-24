// Server Component (use client 없음)
// 그냥 로딩 UI만 보여주면 됨

export default function Loading() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 text-center">
      <p className="text-gray-300">불러오는 중...</p>
    </div>
  );
}