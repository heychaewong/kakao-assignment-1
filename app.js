/* ===================================================
   Todo 앱 - 기본 CRUD + 상태 필터 + 일간 뷰 + 로컬스토리지 + 주간 뷰
   =================================================== */

const STORAGE_KEY = 'todos';

// ── DOM 참조 ──────────────────────────────────────────
const todoInput   = document.getElementById('todoInput');
const addBtn      = document.getElementById('addBtn');
const todoList    = document.getElementById('todoList');
const errorMsg    = document.getElementById('errorMsg');
const emptyMsg    = document.getElementById('emptyMsg');
const filterTabs  = document.getElementById('filterTabs');
const prevDayBtn  = document.getElementById('prevDayBtn');
const nextDayBtn  = document.getElementById('nextDayBtn');
const todayBtn    = document.getElementById('todayBtn');
const dateDisplay = document.getElementById('dateDisplay');
const prevWeekBtn = document.getElementById('prevWeekBtn');
const nextWeekBtn = document.getElementById('nextWeekBtn');
const weekStrip   = document.getElementById('weekStrip');

// ── 상태 ──────────────────────────────────────────────
// 각 todo 항목: { id, text, completed, date }
// date: 'YYYY-MM-DD' 형식 문자열
let todos = [];
let nextId = 1;            // 단순 증가 ID (삭제해도 재사용 안 함)
let currentFilter = 'all'; // 'all' | 'active' | 'completed'
let selectedDate = toDateString(new Date());
let weekBaseMonday = getMonday(selectedDate); // 주간 스트립에 표시할 주의 월요일

// ── 초기화 ────────────────────────────────────────────
loadTodos();
updateDateNav();
renderWeekStrip();
renderAll();

// ── 이벤트 등록 ───────────────────────────────────────

addBtn.addEventListener('click', handleAdd);

todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleAdd();
});

todoInput.addEventListener('input', () => {
  if (todoInput.value.trim()) hideError();
});

filterTabs.addEventListener('click', (e) => {
  const tab = e.target.closest('.filter-tab');
  if (!tab) return;
  currentFilter = tab.dataset.filter;
  updateFilterTabs();
  renderAll();
});

// 이전 날짜 — 주간 스트립도 선택 날짜의 주로 따라감
prevDayBtn.addEventListener('click', () => {
  selectedDate    = shiftDate(selectedDate, -1);
  weekBaseMonday  = getMonday(selectedDate);
  updateDateNav();
  renderWeekStrip();
  renderAll();
});

// 다음 날짜 — 주간 스트립도 선택 날짜의 주로 따라감
nextDayBtn.addEventListener('click', () => {
  selectedDate    = shiftDate(selectedDate, +1);
  weekBaseMonday  = getMonday(selectedDate);
  updateDateNav();
  renderWeekStrip();
  renderAll();
});

todayBtn.addEventListener('click', () => {
  selectedDate   = toDateString(new Date());
  weekBaseMonday = getMonday(selectedDate);
  updateDateNav();
  renderWeekStrip();
  renderAll();
});

// 이전 주 — selectedDate는 바꾸지 않고 스트립만 이동
prevWeekBtn.addEventListener('click', () => {
  weekBaseMonday = shiftDate(weekBaseMonday, -7);
  renderWeekStrip();
});

// 다음 주 — selectedDate는 바꾸지 않고 스트립만 이동
nextWeekBtn.addEventListener('click', () => {
  weekBaseMonday = shiftDate(weekBaseMonday, +7);
  renderWeekStrip();
});

// ── 핸들러 ────────────────────────────────────────────

/** 추가 버튼 / Enter 처리 */
function handleAdd() {
  const text = todoInput.value.trim();
  if (!text) { showError(); return; }
  addTodo(text);
  todoInput.value = '';
  hideError();
}

// ── CRUD 함수 ─────────────────────────────────────────

/** Todo 생성 — 현재 선택된 날짜를 함께 저장 */
function addTodo(text) {
  todos.push({ id: nextId++, text, completed: false, date: selectedDate });
  saveTodos();
  renderWeekStrip(); // 해당 날짜의 Todo 개수 배지 업데이트
  renderAll();
}

/** Todo 완료 상태 토글 */
function toggleComplete(id) {
  const todo = findById(id);
  if (!todo) return;
  todo.completed = !todo.completed;
  saveTodos();
  renderWeekStrip();
  renderAll();
}

/** Todo 텍스트 수정 */
function editTodo(id, newText) {
  const trimmed = newText.trim();
  if (!trimmed) return; // 빈 값이면 수정하지 않음

  const todo = findById(id);
  if (!todo) return;
  todo.text = trimmed;
  saveTodos();
  renderWeekStrip();
  renderAll();
}

/** Todo 삭제 */
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderWeekStrip(); // 삭제 후 배지 숫자 업데이트
  renderAll();
}

// ── 렌더링 ────────────────────────────────────────────

/**
 * 선택된 날짜의 Todo를 상태 필터까지 적용해 반환
 * 날짜 필터 → 상태 필터 순으로 적용
 */
function getFilteredTodos() {
  const byDate = todos.filter((t) => t.date === selectedDate);
  if (currentFilter === 'active')    return byDate.filter((t) => !t.completed);
  if (currentFilter === 'completed') return byDate.filter((t) =>  t.completed);
  return byDate; // 'all'
}

/** 선택된 탭 강조 업데이트 */
function updateFilterTabs() {
  filterTabs.querySelectorAll('.filter-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.filter === currentFilter);
  });
}

/** 날짜 표시 텍스트와 '오늘' 버튼 가시성 업데이트 */
function updateDateNav() {
  dateDisplay.textContent = formatDateLabel(selectedDate);
  const isToday = selectedDate === toDateString(new Date());
  todayBtn.classList.toggle('hidden', isToday);
}

/**
 * 주간 스트립 렌더링
 * weekBaseMonday 기준으로 월~일 7개 셀을 나열
 * 각 셀에 요일명, 날짜, Todo 개수 배지 표시
 */
function renderWeekStrip() {
  const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
  const todayStr  = toDateString(new Date());

  weekStrip.innerHTML = '';

  for (let i = 0; i < 7; i++) {
    const dateStr = shiftDate(weekBaseMonday, i);
    const date    = new Date(dateStr + 'T00:00:00');

    // 해당 날짜의 전체 Todo 개수 (상태 필터 무관)
    const count = todos.filter((t) => t.date === dateStr).length;

    const isToday    = dateStr === todayStr;
    const isSelected = dateStr === selectedDate;

    const cell = document.createElement('button');
    cell.className = 'week-day-cell';
    if (isToday)    cell.classList.add('today');
    if (isSelected) cell.classList.add('selected');
    cell.setAttribute('aria-pressed', isSelected ? 'true' : 'false');

    // 요일 이름
    const nameEl = document.createElement('span');
    nameEl.className = 'week-day-name';
    nameEl.textContent = DAY_NAMES[date.getDay()];

    // 날짜 숫자
    const numEl = document.createElement('span');
    numEl.className = 'week-day-num';
    numEl.textContent = date.getDate();

    // Todo 개수 배지 — 0이면 숨김
    const countEl = document.createElement('span');
    countEl.className = 'week-day-count' + (count === 0 ? ' hidden' : '');
    countEl.textContent = count;

    cell.append(nameEl, numEl, countEl);

    // 클릭 시 해당 날짜 선택 및 일간 네비게이터 동기화
    cell.addEventListener('click', () => {
      selectedDate   = dateStr;
      weekBaseMonday = getMonday(dateStr);
      updateDateNav();
      renderWeekStrip();
      renderAll();
    });

    weekStrip.appendChild(cell);
  }
}

/** 전체 목록 다시 그리기 (날짜 + 상태 필터 적용) */
function renderAll() {
  todoList.innerHTML = '';
  const filtered = getFilteredTodos();
  emptyMsg.classList.toggle('hidden', filtered.length > 0);
  filtered.forEach((todo) => todoList.appendChild(createTodoElement(todo)));
}

/**
 * 일반 보기 모드 li 요소 생성
 * @param {{ id: number, text: string, completed: boolean, date: string }} todo
 */
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item' + (todo.completed ? ' completed' : '');
  li.dataset.id = todo.id;

  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = todo.text;

  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  const completeBtn = createButton(
    todo.completed ? '취소' : '완료',
    'btn btn-complete',
    () => toggleComplete(todo.id)
  );

  const editBtn = createButton('수정', 'btn btn-edit', () =>
    switchToEditMode(li, todo)
  );
  editBtn.disabled = todo.completed;

  const deleteBtn = createButton('삭제', 'btn btn-delete', () => {
    if (confirm('정말로 삭제하시겠습니까?')) deleteTodo(todo.id);
  });

  actions.append(completeBtn, editBtn, deleteBtn);
  li.append(span, actions);
  return li;
}

/**
 * 수정 모드 UI로 전환 (li 내부를 인라인으로 교체)
 * @param {HTMLElement} li
 * @param {{ id: number, text: string, completed: boolean, date: string }} todo
 */
function switchToEditMode(li, todo) {
  li.innerHTML = '';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = todo.text;
  input.maxLength = 200;

  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  const saveBtn   = createButton('저장', 'btn btn-save',   () => editTodo(todo.id, input.value));
  const cancelBtn = createButton('취소', 'btn btn-cancel', () => renderAll());

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  editTodo(todo.id, input.value);
    if (e.key === 'Escape') renderAll();
  });

  actions.append(saveBtn, cancelBtn);
  li.append(input, actions);

  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}

// ── 로컬스토리지 ──────────────────────────────────────

/** 현재 todos 배열을 JSON으로 직렬화해 로컬스토리지에 저장 */
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

/**
 * 로컬스토리지에서 todos를 복원하고 nextId를 재계산
 * 저장된 데이터가 없거나 파싱에 실패하면 빈 배열로 시작
 */
function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    todos = JSON.parse(saved);
    // 기존 ID 중 최댓값 + 1 로 nextId를 설정해 ID 충돌 방지
    if (todos.length > 0) {
      nextId = Math.max(...todos.map((t) => t.id)) + 1;
    }
  } catch {
    // 저장 데이터가 손상된 경우 초기 상태로 복구
    todos = [];
  }
}

// ── 날짜 유틸리티 ─────────────────────────────────────

/**
 * Date 객체를 'YYYY-MM-DD' 문자열로 변환 (로컬 시간 기준)
 * toISOString은 UTC 기준이라 시간대에 따라 날짜가 밀릴 수 있어 직접 구성
 */
function toDateString(date) {
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
function shiftDate(dateStr, delta) {
  const date = new Date(dateStr + 'T00:00:00'); // 로컬 자정으로 파싱
  date.setDate(date.getDate() + delta);
  return toDateString(date);
}

/**
 * 주어진 날짜가 속한 주의 월요일 날짜 문자열 반환
 * 일요일(0)은 -6, 나머지는 (1 - getDay())로 월요일 계산
 */
function getMonday(dateStr) {
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
function formatDateLabel(dateStr) {
  const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
  const date = new Date(dateStr + 'T00:00:00');
  const y    = date.getFullYear();
  const m    = date.getMonth() + 1;
  const d    = date.getDate();
  const day  = DAY_NAMES[date.getDay()];
  const isToday = dateStr === toDateString(new Date());
  return `${isToday ? '오늘 · ' : ''}${y}년 ${m}월 ${d}일 (${day})`;
}

// ── 공통 유틸리티 ─────────────────────────────────────

/** ID로 todo 항목 찾기 */
function findById(id) {
  return todos.find((t) => t.id === id) || null;
}

/**
 * 버튼 요소 생성 헬퍼
 * @param {string} label
 * @param {string} className
 * @param {Function} onClick
 */
function createButton(label, className, onClick) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.className = className;
  btn.addEventListener('click', onClick);
  return btn;
}

function showError() {
  errorMsg.classList.remove('hidden');
  todoInput.focus();
}

function hideError() {
  errorMsg.classList.add('hidden');
}
