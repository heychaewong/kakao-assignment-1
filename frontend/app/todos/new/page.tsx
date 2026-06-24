'use client'; // 입력폼, 버튼 클릭 이벤트 필요

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewTodoPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
  if (!title.trim()) return;
  setIsLoading(true);

  // 로컬 시간 기준으로 날짜 만들기
  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title,
      completed: false,
      date, // 로컬 날짜!
    }),
  });

  router.push('/todos');
  router.refresh();
}

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-purple-600 mb-6">새 Todo 추가</h1>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="할 일을 입력하세요"
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? '추가 중...' : '추가'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-5 py-2 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}