'use server';

const API_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function getTodos(filter?: string, search?: string) {
  const params = new URLSearchParams();
  if (filter) params.set('filter', filter);
  if (search) params.set('search', search);

  const url = `${API_URL}/todos${params.toString() ? '?' + params.toString() : ''}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Todo 목록을 불러오지 못했습니다');
  return res.json();
}

export async function getTodo(id: number) {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Todo를 불러오지 못했습니다');
  return res.json();
}