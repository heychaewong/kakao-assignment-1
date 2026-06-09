/**
 * DateNav — 일간 날짜 네비게이터
 * 이전/다음 날짜 이동 버튼, 현재 날짜 레이블, "오늘" 복귀 버튼을 표시
 * 오늘 날짜를 보고 있을 때는 "오늘" 버튼을 숨김
 */
import { toDateString, formatDateLabel } from '../utils/dateUtils';

export default function DateNav({ selectedDate, onPrevDay, onNextDay, onToday }) {
  // 선택된 날짜가 오늘인지 확인 — 오늘이면 "오늘" 버튼 숨김
  const isToday = selectedDate === toDateString(new Date());

  return (
    <div className="flex items-center justify-between mb-3">
      {/* 이전 날짜 버튼 */}
      <button
        onClick={onPrevDay}
        aria-label="이전 날짜"
        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary-light rounded-lg transition-colors cursor-pointer text-lg"
      >
        ‹
      </button>

      {/* 날짜 레이블 + 오늘 복귀 버튼 */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          {formatDateLabel(selectedDate)}
        </span>
        {/* 오늘이 일때만 "오늘" 버튼 표시 */}
        {isToday && (
          <button
            onClick={onToday}
            className="px-2 py-0.5 text-xs font-medium text-primary bg-primary-light rounded-md hover:bg-primary/20 transition-colors cursor-pointer"
          >
            오늘
          </button>
        )}
      </div>

      {/* 다음 날짜 버튼 */}
      <button
        onClick={onNextDay}
        aria-label="다음 날짜"
        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary-light rounded-lg transition-colors cursor-pointer text-lg"
      >
        ›
      </button>
    </div>
  );
}
