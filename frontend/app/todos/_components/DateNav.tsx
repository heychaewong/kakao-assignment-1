'use client';

export default function DateNav({
  selectedDate,
  onPrevDay,
  onNextDay,
  onToday,
}: {
  selectedDate: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}) {
  const toDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatDateLabel = (dateStr: string) => {
    const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateStr + 'T00:00:00');
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const day = DAY_NAMES[date.getDay()];
    const isToday = dateStr === toDateString(new Date());
    return `${isToday ? '오늘 · ' : ''}${y}년 ${m}월 ${d}일 (${day})`;
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="flex items-center justify-between mb-3">
      <button
        onClick={onPrevDay}
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors text-xl"
      >
        ‹
      </button>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">
          {formatDateLabel(selectedDate)}
        </span>
        {isToday && (
          <button
            onClick={onToday}
            className="px-2 py-0.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
          >
            오늘
          </button>
        )}
      </div>
      <button
        onClick={onNextDay}
        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors text-xl"
      >
        ›
      </button>
    </div>
  );
}