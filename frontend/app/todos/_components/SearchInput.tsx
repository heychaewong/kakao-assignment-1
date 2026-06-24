'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');

  // Debounce - 0.5초 후에 URL 업데이트
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set('search', search);
      } else {
        params.delete('search');
      }
      router.push(`/todos?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timer); // 입력할 때마다 타이머 초기화
  }, [search]);

  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="검색어를 입력하세요"
      className="w-full px-4 py-2 mb-4 border border-gray-200 rounded-lg text-sm outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
    />
  );
}