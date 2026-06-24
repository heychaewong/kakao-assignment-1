import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
  // 1. TodoApp.tsx에서 보낸 파라미터 꺼내기
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('filter') ?? '';
  const search = searchParams.get('search') ?? '';
  const date = searchParams.get('date') ?? '';

  // 2. FastAPI한테 그대로 전달하기
  const params = new URLSearchParams();
  // params = {} 빈 객체임
  if (filter) params.set('filter', filter);
  // filter가 있다면 추가해서 보냄, 나머지 2개도 똑같음
  if (search) params.set('search', search);
  if (date) params.set('date', date);

  const res = await fetch(`${API_URL}/todos?${params.toString()}`);
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}