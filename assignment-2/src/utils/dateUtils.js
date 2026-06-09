/**
 * 날짜 관련 유틸리티 함수 모음
 * VanillaJS 버전의 날짜 헬퍼 함수들을 모듈로 분리
 */

/**
 * Date 객체를 'YYYY-MM-DD' 문자열로 변환 (로컬 시간 기준)
 * toISOString은 UTC 기준이라 시간대에 따라 날짜가 밀릴 수 있어 직접 구성
 */
export function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 'YYYY-MM-DD' 문자열을 delta일만큼 이동한 새 문자열 반환
 * @param {string} dateStr
 * @param {number} delta - 음수면 과거, 양수면 미래
 */
export function shiftDate(dateStr, delta) {
  const date = new Date(dateStr + 'T00:00:00'); // 로컬 자정으로 파싱
  date.setDate(date.getDate() + delta);
  return toDateString(date);
}

/**
 * 주어진 날짜가 속한 주의 월요일 날짜 문자열 반환
 * 일요일(0)은 -6, 나머지는 (1 - getDay())로 월요일 계산
 */
export function getMonday(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  const day  = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return toDateString(date);
}

/**
 * 'YYYY-MM-DD' 문자열을 화면용 레이블로 변환
 * 오늘이면 "오늘 · YYYY년 M월 D일 (요일)" 형식
 */
export function formatDateLabel(dateStr) {
  const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
  const date = new Date(dateStr + 'T00:00:00');
  const y    = date.getFullYear();
  const m    = date.getMonth() + 1;
  const d    = date.getDate();
  const day  = DAY_NAMES[date.getDay()];
  const isToday = dateStr === toDateString(new Date());
  return `${isToday ? '오늘 · ' : ''}${y}년 ${m}월 ${d}일 (${day})`;
}
