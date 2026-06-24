'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DateNav from './DateNav';
import WeekStrip from './WeekStrip';

function toDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getMonday(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return toDateString(date);
}

function shiftDate(dateStr: string, delta: number) {
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() + delta);
  return toDateString(date);
}

type Todo = { id: number; title: string; completed: boolean; date: string };

const TABS = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행 중' },
  { value: 'completed', label: '완료' },
];

export default function TodoApp() {
  const today = toDateString(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekBaseMonday, setWeekBaseMonday] = useState(getMonday(today));
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);

  // Todo 목록 불러오기
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('filter', filter);
    if (search) params.set('search', search);
    params.set('date', selectedDate);
    // if (filter !== 'completed') params.set('date', selectedDate);

    fetch(`/api/todos?${params.toString()}`)
      .then((res) => res.json())
      .then(setTodos);
  }, [filter, search, selectedDate]);

  // 날짜 이동
  function handlePrevDay() {
    const newDate = shiftDate(selectedDate, -1);
    setSelectedDate(newDate);
    setWeekBaseMonday(getMonday(newDate));
  }

  function handleNextDay() {
    const newDate = shiftDate(selectedDate, +1);
    setSelectedDate(newDate);
    setWeekBaseMonday(getMonday(newDate));
  }

  function handleToday() {
    setSelectedDate(today);
    setWeekBaseMonday(getMonday(today));
  }

  function handleSelectDate(dateStr: string) {
    setSelectedDate(dateStr);
    setWeekBaseMonday(getMonday(dateStr));
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-600 mb-6">Todo</h1>

      {/* 날짜 네비게이터 */}
      <DateNav
        selectedDate={selectedDate}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onToday={handleToday}
      />

      {/* 주간 스트립 */}
      <WeekStrip
        weekBaseMonday={weekBaseMonday}
        selectedDate={selectedDate}
        onSelectDate={handleSelectDate}
        onPrevWeek={() => setWeekBaseMonday((prev) => shiftDate(prev, -7))}
        onNextWeek={() => setWeekBaseMonday((prev) => shiftDate(prev, +7))}
      />

      {/* 검색창 */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="할 일을 입력하세요"
        className="w-full px-4 py-3 mb-4 border border-gray-200 rounded-xl text-sm outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
      />

      {/* 필터 탭 */}
      <div className="flex gap-2 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={[
              'px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
              filter === tab.value
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Todo 목록 */}
      {todos.length === 0 ? (
        <p className="text-center text-gray-300 py-12">등록된 할 일이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-50"
            >
              <span className={todo.completed ? 'line-through text-gray-300' : 'text-gray-700'}>
                {todo.title}
              </span>
              <Link
                href={`/todos/${todo.id}`}
                className="text-xs text-gray-400 hover:text-purple-600"
              >
                수정
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* 추가 버튼 */}
      <Link
        href="/todos/new"
        className="fixed bottom-8 right-8 px-6 py-3 bg-purple-600 text-white text-sm font-medium rounded-full hover:bg-purple-700 shadow-lg"
      >
        + 추가
      </Link>
    </div>
  );
}