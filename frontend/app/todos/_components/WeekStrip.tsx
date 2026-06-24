'use client';

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

function toDateString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function shiftDate(dateStr: string, delta: number) {
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() + delta);
  return toDateString(date);
}

export default function WeekStrip({
  weekBaseMonday,
  selectedDate,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
}: {
  weekBaseMonday: string;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}) {
  const todayStr = toDateString(new Date());

  return (
    <div className="mb-5">
      <div className="flex items-center gap-1">
        <button
          onClick={onPrevWeek}
          className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors shrink-0"
        >
          ‹
        </button>

        <div className="flex flex-1 gap-1">
          {Array.from({ length: 7 }, (_, i) => {
            const dateStr = shiftDate(weekBaseMonday, i);
            const date = new Date(dateStr + 'T00:00:00');
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;

            return (
              <button
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
                className={[
                  'flex flex-col items-center gap-0.5 flex-1 py-2 rounded-xl transition-colors',
                  isSelected
                    ? 'bg-purple-600 text-white'
                    : isToday
                    ? 'bg-purple-50 text-purple-600'
                    : 'hover:bg-gray-50 text-gray-500',
                ].join(' ')}
              >
                <span className="text-[10px] font-medium opacity-70">
                  {DAY_NAMES[date.getDay()]}
                </span>
                <span className="text-sm font-semibold">
                  {date.getDate()}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onNextWeek}
          className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors shrink-0"
        >
          ›
        </button>
      </div>
    </div>
  );
}