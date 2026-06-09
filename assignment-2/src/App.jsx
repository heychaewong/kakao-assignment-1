/**
 * App — 루트 컴포넌트
 * useTodos 훅에서 상태와 액션을 가져와 각 컴포넌트에 props로 전달
 */
import { useTodos } from './hooks/useTodos';
import { toDateString, shiftDate, getMonday } from './utils/dateUtils';
import DateNav    from './components/DateNav';
import WeekStrip  from './components/WeekStrip';
import TodoInput  from './components/TodoInput';
import FilterTabs from './components/FilterTabs';
import TodoList   from './components/TodoList';

export default function App() {
  const {
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
  } = useTodos();

  // 이전 날짜로 이동 — 주간 스트립도 선택 날짜의 주로 따라감
  function handlePrevDay() {
    const newDate = shiftDate(selectedDate, -1);
    setSelectedDate(newDate);
    setWeekBaseMonday(getMonday(newDate));
  }

  // 다음 날짜로 이동 — 주간 스트립도 선택 날짜의 주로 따라감
  function handleNextDay() {
    const newDate = shiftDate(selectedDate, +1);
    setSelectedDate(newDate);
    setWeekBaseMonday(getMonday(newDate));
  }

  // 오늘로 복귀
  function handleToday() {
    const today = toDateString(new Date());
    setSelectedDate(today);
    setWeekBaseMonday(getMonday(today));
  }

  // 주간 스트립에서 날짜 선택 — 일간 네비게이터도 동기화
  function handleSelectDate(dateStr) {
    setSelectedDate(dateStr);
    setWeekBaseMonday(getMonday(dateStr));
  }

  // 이전 주로 이동 — selectedDate는 바꾸지 않고 스트립만 이동
  function handlePrevWeek() {
    setWeekBaseMonday((prev) => shiftDate(prev, -7));
  }

  // 다음 주로 이동 — selectedDate는 바꾸지 않고 스트립만 이동
  function handleNextWeek() {
    setWeekBaseMonday((prev) => shiftDate(prev, +7));
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Todo</h1>

        {/* 일간 날짜 네비게이터 */}
        <DateNav
          selectedDate={selectedDate}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
          onToday={handleToday}
        />

        {/* 주간 뷰 스트립 */}
        <WeekStrip
          weekBaseMonday={weekBaseMonday}
          selectedDate={selectedDate}
          todos={todos}
          onSelectDate={handleSelectDate}
          onPrevWeek={handlePrevWeek}
          onNextWeek={handleNextWeek}
        />

        {/* 할 일 입력 영역 */}
        <TodoInput onAdd={addTodo} />

        {/* 상태 필터 탭 */}
        <FilterTabs
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
        />

        {/* Todo 목록 */}
        <TodoList
          todos={getFilteredTodos()}
          onToggle={toggleTodo}
          onEdit={editTodo}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  );
}
