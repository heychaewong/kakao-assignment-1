/**
 * TodoInput — 할 일 입력 영역
 * 텍스트 입력창, 추가 버튼, 빈 입력 에러 메시지를 포함
 * 입력값이 비어있으면 에러 메시지를 표시하고 Todo를 추가하지 않음
 */
import { useState } from 'react';

export default function TodoInput({ onAdd }) {
  // 입력창 텍스트 상태
  const [inputText, setInputText] = useState('');
  // 빈 입력 에러 메시지 표시 여부
  const [showError, setShowError] = useState(false);

  /** 추가 버튼 클릭 또는 Enter 키 처리 */
  function handleAdd() {
    const trimmed = inputText.trim();
    if (!trimmed) {
      // 입력값이 없으면 에러 메시지 표시
      setShowError(true);
      return;
    }
    onAdd(trimmed);
    setInputText('');
    setShowError(false);
  }

  /** 입력값이 바뀌면 에러 메시지 숨김 */
  function handleChange(e) {
    setInputText(e.target.value);
    if (e.target.value.trim()) setShowError(false);
  }

  return (
    <div className="mb-4">
      {/* 입력창 + 추가 버튼 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="할 일을 입력하세요"
          maxLength={200}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
        />
        <button
          onClick={handleAdd}
          className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
        >
          추가
        </button>
      </div>

      {/* 빈 입력 안내 메시지 — showError가 true일 때만 표시 */}
      {showError && (
        <p className="mt-1.5 text-xs text-red-500">할 일을 입력해주세요.</p>
      )}
    </div>
  );
}
