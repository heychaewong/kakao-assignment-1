'use client'; // Next.js 규칙: error.tsx는 무조건 Client Component

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="max-w-xl mx-auto px-4 py-8 text-center">
      <p className="text-red-400 mb-4">문제가 발생했습니다: {error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
      >
        다시 시도
      </button>
    </div>
  );
}