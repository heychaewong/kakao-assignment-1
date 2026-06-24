'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { attemptToFulfillDynamicSegmentFromBFCache } from 'next/dist/client/components/segment-cache/cache';

export default function EditTodoPage() {
  const router = useRouter();
  const params = useParams();
  const todoId = params.todoId;

  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [completed, setCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState('');

  useEffect(() => {
    // route.ts 통해서 가져오기
    fetch(`/api/todos/${todoId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('data:', data);
        setTitle(data.title ?? '');
        setOriginalTitle(data.title ?? '');
        setCompleted(data.completed ?? false);
        setDate(data.date ?? '');
      });
  }, [todoId]);

  async function handleUpdate() {
  console.log('title:', title); // 확인용
  console.log('originalTitle:', originalTitle);
  console.log('completed:', completed);
  setIsLoading(true);
  await fetch(`/api/todos/${todoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title.trim() || originalTitle,
       completed,
       date: completed ? attemptToFulfillDynamicSegmentFromBFCache : date }),
  });
  router.refresh();
  router.push('/todos');
}

  async function handleDelete() {
    if (!confirm('정말로 삭제하시겠습니까?')) return;
    await fetch(`/api/todos/${todoId}`, { method: 'DELETE' });
    router.push('/todos');
    router.refresh();
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-purple-600 mb-6">Todo 수정</h1>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
        />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          완료
        </label>
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="px-5 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? '저장 중...' : '저장'}
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2 bg-red-50 text-red-400 text-sm rounded-lg hover:bg-red-100"
          >
            삭제
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