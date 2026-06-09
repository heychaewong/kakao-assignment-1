/**
 * TodoItem — 개별 Todo 항목
 * isEditing 상태에 따라 일반 보기 모드와 인라인 수정 모드를 전환
 *
 * isEditing = false : 텍스트 + 완료/수정/삭제 버튼 표시
 * isEditing = true  : 텍스트 입력창 + 저장/취소 버튼 표시
 */
import { useState } from 'react';

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  // 수정 모드 활성화 여부
  const [isEditing, setIsEditing] = useState(false);
  // 수정 모드에서 관리하는 임시 텍스트 (저장 전까지 원본에 영향 없음)
  const [editText, setEditText] = useState(todo.text);

  /** 수정 모드 진입 — 현재 텍스트를 임시 상태에 복사 */
  function handleEditStart() {
    setIsEditing(true);
    setEditText(todo.text);
  }

  /** 수정 내용 저장 — 부모의 onEdit 호출 후 보기 모드로 복귀 */
  function handleEditSave() {
    onEdit(todo.id, editText);
    setIsEditing(false);
  }

  /** 수정 취소 — 임시 텍스트를 버리고 보기 모드로 복귀 */
  function handleEditCancel() {
    setIsEditing(false);
  }

  // ── 수정 모드 ─────────────────────────────────────────
  if (isEditing) {
    return (
      <li className="flex items-center gap-2 py-3 px-4 bg-primary-light rounded-lg">
        <input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter')  handleEditSave();
            if (e.key === 'Escape') handleEditCancel();
          }}
          maxLength={200}
          autoFocus
          className="flex-1 px-3 py-1.5 text-sm border border-primary/40 rounded-md outline-none focus:ring-2 focus:ring-primary/20 bg-white"
        />
        <button
          onClick={handleEditSave}
          className="px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-md hover:bg-primary-hover transition-colors cursor-pointer"
        >
          저장
        </button>
        <button
          onClick={handleEditCancel}
          className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
        >
          취소
        </button>
      </li>
    );
  }

  // ── 보기 모드 ─────────────────────────────────────────
  return (
    <li className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gray-50 group transition-colors">
      {/* 완료 여부에 따라 텍스트 스타일 변경 — 완료 시 취소선 + 흐린 색상 */}
      <span
        className={[
          'flex-1 text-sm',
          todo.completed
            ? 'line-through text-gray-300'  // 완료 상태: 취소선 + 회색
            : 'text-gray-700',              // 진행 중: 기본 색상
        ].join(' ')}
      >
        {todo.text}
      </span>

      {/* 액션 버튼 — 평소에는 흐리게, 호버 시 표시 */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggle(todo.id)}
          className={[
            'px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer',
            todo.completed
              ? 'text-gray-500 bg-gray-100 hover:bg-gray-200'       // 완료 상태: 취소 버튼
              : 'text-primary bg-primary-light hover:bg-primary/20', // 진행 중: 완료 버튼
          ].join(' ')}
        >
          {todo.completed ? '취소' : '완료'}
        </button>

        {/* 완료된 항목은 수정 불가 */}
        <button
          onClick={handleEditStart}
          disabled={todo.completed}
          className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          수정
        </button>

        <button
          onClick={() => {
            if (confirm('정말로 삭제하시겠습니까?')) onDelete(todo.id);
          }}
          className="px-3 py-1 text-xs font-medium text-red-400 bg-red-50 rounded-md hover:bg-red-100 transition-colors cursor-pointer"
        >
          삭제
        </button>
      </div>
    </li>
  );
}
