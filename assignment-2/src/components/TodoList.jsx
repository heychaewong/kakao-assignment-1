/**
 * TodoList — Todo 목록
 * 필터링된 Todo 항목들을 렌더링하고, 항목이 없을 때 빈 상태 메시지 표시
 */
import TodoItem from './TodoItem';

export default function TodoList({ todos, onToggle, onEdit, onDelete }) {
  // Todo가 없을 때 빈 상태 안내 메시지 표시
  if (todos.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-300">
        등록된 할 일이 없습니다.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {todos.map((todo) => (
        // todo.id를 key로 사용해 React가 항목을 안정적으로 추적
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
