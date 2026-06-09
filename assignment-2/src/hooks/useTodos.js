/**
 * Todo CRUD + localStorage 상태 관리 커스텀 훅
 * 앱의 핵심 상태(todos, 필터, 날짜)와 액션을 한 곳에서 관리
 */
import { useState, useEffect, useCallback } from 'react';
import { toDateString, getMonday } from '../utils/dateUtils';

const STORAGE_KEY      = 'todos';
const WEEK_STORAGE_KEY = 'weekBaseMonday'; // 주간 스트립 위치를 별도 키로 저장

/** localStorage에서 todos를 불러와 초기 상태를 반환 */
function loadInitialTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { todos: [], nextId: 1 };
    const todos = JSON.parse(saved); // JSON 문자열 → 배열로 파싱
    // 기존 ID 중 최댓값 + 1 로 nextId를 설정해 ID 충돌 방지
    const nextId = todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
    return { todos, nextId };
  } catch {
    // 저장 데이터가 손상된 경우 초기 상태로 복구
    return { todos: [], nextId: 1 };
  }
}

export function useTodos() {
  const today = toDateString(new Date());

  // todos 배열과 다음 ID를 함께 관리
  const [{ todos, nextId }, setTodoState] = useState(loadInitialTodos);

  // 현재 선택된 날짜 (일간 뷰 기준)
  const [selectedDate, setSelectedDate] = useState(today);

  // 주간 스트립에 표시할 주의 월요일 날짜 — 새로고침 후에도 복원
  const [weekBaseMonday, setWeekBaseMonday] = useState(
    () => localStorage.getItem(WEEK_STORAGE_KEY) ?? getMonday(today)
  );

  // 상태 필터: 'all' | 'active' | 'completed'
  const [currentFilter, setCurrentFilter] = useState('all');

  /**
   * todos가 변경될 때마다 자동으로 localStorage에 저장
   * 각 액션 함수에서 개별 저장하는 대신 여기서 일괄 처리
   */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); // 배열 → JSON 문자열로 직렬화
  }, [todos]);

  /**
   * 주간 스트립 위치(weekBaseMonday)가 바뀔 때마다 localStorage에 저장
   * 새로고침 후에도 같은 주를 보고 있던 상태로 복원
   */
  useEffect(() => {
    localStorage.setItem(WEEK_STORAGE_KEY, weekBaseMonday);
  }, [weekBaseMonday]);

  /** 새 Todo 추가 — 현재 선택된 날짜를 함께 저장 */
  const addTodo = useCallback((text) => {
    setTodoState((prev) => ({
      todos: [...prev.todos, { id: prev.nextId, text, completed: false, date: selectedDate }],
      nextId: prev.nextId + 1,
    }));
  }, [selectedDate]);

  /** Todo 완료 상태 토글 */
  const toggleTodo = useCallback((id) => {
    setTodoState((prev) => ({
      ...prev,
      todos: prev.todos.map((t) => t.id === id ? { ...t, completed: !t.completed } : t),
    }));
  }, []);

  /** Todo 텍스트 수정 */
  const editTodo = useCallback((id, newText) => {
    const trimmed = newText.trim();
    if (!trimmed) return; // 빈 값이면 수정하지 않음
    setTodoState((prev) => ({
      ...prev,
      todos: prev.todos.map((t) => t.id === id ? { ...t, text: trimmed } : t),
    }));
  }, []);

  /** Todo 삭제 */
  const deleteTodo = useCallback((id) => {
    setTodoState((prev) => ({
      ...prev,
      todos: prev.todos.filter((t) => t.id !== id),
    }));
  }, []);

  /**
   * 선택된 날짜의 Todo를 상태 필터까지 적용해 반환
   * 날짜 필터 → 상태 필터 순으로 적용
   */
  const getFilteredTodos = useCallback(() => {
    const byDate = todos.filter((t) => t.date === selectedDate);
    if (currentFilter === 'active')    return byDate.filter((t) => !t.completed);
    if (currentFilter === 'completed') return byDate.filter((t) =>  t.completed);
    return byDate; // 'all'
  }, [todos, selectedDate, currentFilter]);

  return {
    todos,
    selectedDate,
    setSelectedDate,
    weekBaseMonday,
    setWeekBaseMonday,
    currentFilter,
    setCurrentFilter,
    addTodo,
    toggleTodo,
    editTodo,
    deleteTodo,
    getFilteredTodos,
  };
}
