/**
 * WeekStrip — 주간 뷰 스트립
 * weekBaseMonday 기준 월~일 7개 셀을 나열
 * 각 셀에 요일명, 날짜, Todo 개수 배지 표시
 */
import { toDateString, shiftDate } from '../utils/dateUtils';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export default function WeekStrip({
  weekBaseMonday,
  selectedDate,
  todos,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
}) {
  const todayStr = toDateString(new Date());

  return (
    <div className="mb-5">
      {/* 이전/다음 주 버튼 + 7개 셀 */}
      <div className="flex items-center gap-1">
        <button
          onClick={onPrevWeek}
          aria-label="이전 주"
          className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-primary hover:bg-primary-light rounded-lg transition-colors cursor-pointer shrink-0"
        >
          ‹
        </button>

        <div className="flex flex-1 gap-1">
          {Array.from({ length: 7 }, (_, i) => {
            const dateStr   = shiftDate(weekBaseMonday, i);
            const date      = new Date(dateStr + 'T00:00:00');
            const count     = todos.filter((t) => t.date === dateStr).length;
            const isToday   = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;

            return (
              <button
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
                aria-pressed={isSelected}
                className={[
                  'flex flex-col items-center gap-0.5 flex-1 py-2 rounded-xl transition-colors cursor-pointer',
                  isSelected
                    ? 'bg-primary text-white'
                    : isToday
                    ? 'bg-primary-light text-primary'
                    : 'hover:bg-gray-50 text-gray-500',
                ].join(' ')}
              >
                {/* 요일명 */}
                <span className="text-[10px] font-medium opacity-70">
                  {DAY_NAMES[date.getDay()]}
                </span>

                {/* 날짜 숫자 */}
                <span className="text-sm font-semibold">
                  {date.getDate()}
                </span>

                {/* Todo 개수 배지 — 0이면 숨김 */}
                <span
                  className={[
                    'w-1.5 h-1.5 rounded-full',
                    count === 0
                      ? 'invisible'
                      : isSelected
                      ? 'bg-white/70'
                      : 'bg-primary',
                  ].join(' ')}
                />
              </button>
            );
          })}
        </div>

        <button
          onClick={onNextWeek}
          aria-label="다음 주"
          className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-primary hover:bg-primary-light rounded-lg transition-colors cursor-pointer shrink-0"
        >
          ›
        </button>
      </div>
    </div>
  );
}
