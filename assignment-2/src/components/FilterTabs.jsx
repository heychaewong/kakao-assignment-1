/**
 * FilterTabs — 상태 필터 탭
 * 전체 / 진행 중 / 완료 탭을 표시하고 현재 선택된 탭을 강조
 */

// 탭 목록을 배열로 관리해 반복 렌더링
const TABS = [
  { value: 'all',       label: '전체' },
  { value: 'active',    label: '진행 중' },
  { value: 'completed', label: '완료' },
];

export default function FilterTabs({ currentFilter, onFilterChange }) {
  return (
    <div className="flex gap-1 mb-4 border-b border-gray-100">
      {TABS.map((tab) => {
        const isActive = tab.value === currentFilter;
        return (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={[
              'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors cursor-pointer',
              isActive
                ? 'text-primary border-b-2 border-primary'   // 선택된 탭: 메인 컬러 강조
                : 'text-gray-400 hover:text-gray-600',        // 비선택 탭: 흐리게
            ].join(' ')}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
