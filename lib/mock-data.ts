// 학생 데이터 샘플
export const mockStudents = [
  { id: "20230001", name: "김민준", grade: "3", class: "8", number: "1", attendanceRate: 95 },
  { id: "20230002", name: "이서연", grade: "3", class: "8", number: "2", attendanceRate: 92 },
  { id: "20230003", name: "박지훈", grade: "3", class: "8", number: "3", attendanceRate: 88 },
  { id: "20230004", name: "최수아", grade: "3", class: "8", number: "4", attendanceRate: 100 },
  { id: "20230005", name: "정우진", grade: "3", class: "8", number: "5", attendanceRate: 85 },
  { id: "20230006", name: "강하은", grade: "3", class: "8", number: "6", attendanceRate: 90 },
  { id: "20230007", name: "조현우", grade: "3", class: "8", number: "7", attendanceRate: 97 },
  { id: "20230008", name: "윤지민", grade: "3", class: "8", number: "8", attendanceRate: 93 },
  { id: "20230009", name: "임준호", grade: "3", class: "8", number: "9", attendanceRate: 82 },
  { id: "20230010", name: "한소희", grade: "3", class: "8", number: "10", attendanceRate: 91 },
]

// 주간 출석 데이터 샘플
export const mockWeeklyAttendanceData = [
  {
    weekStart: "2025-03-10",
    weekEnd: "2025-03-14",
    attendance: [
      { date: "2025-03-14", day: "금", period1: true, period2: true, period3: true, className: "3학년 8반" },
      { date: "2025-03-13", day: "목", period1: true, period2: true, period3: true, className: "3학년 8반" },
      { date: "2025-03-12", day: "수", period1: true, period2: false, period3: true, className: "3학년 8반" },
      { date: "2025-03-11", day: "화", period1: true, period2: true, period3: false, className: "3학년 8반" },
      { date: "2025-03-10", day: "월", period1: true, period2: true, period3: true, className: "3학년 8반" },
    ],
    classAttendance: [28, 30, 27, 29, 31], // 각 날짜별 출석 인원
    totalStudents: 32,
    classAvgAttendance: 90.6, // 반 평균 출석률
  },
  {
    weekStart: "2025-03-03",
    weekEnd: "2025-03-07",
    attendance: [
      { date: "2025-03-07", day: "금", period1: true, period2: true, period3: true, className: "3학년 8반" },
      { date: "2025-03-06", day: "목", period1: false, period2: false, period3: false, className: "3학년 8반" },
      { date: "2025-03-05", day: "수", period1: true, period2: true, period3: true, className: "3학년 8반" },
      { date: "2025-03-04", day: "화", period1: true, period2: true, period3: true, className: "3학년 8반" },
      { date: "2025-03-03", day: "월", period1: true, period2: true, period3: false, className: "3학년 8반" },
    ],
    classAttendance: [30, 29, 28, 31, 30], // 각 날짜별 출석 인원
    totalStudents: 32,
    classAvgAttendance: 92.5, // 반 평균 출석률
  },
]

// 학급별 출석률 샘플
export const mockClassAttendanceData = [
  { className: "1학년 1반", rate: 92 },
  { className: "1학년 2반", rate: 91 },
  { className: "1학년 3반", rate: 88 },
  { className: "1학년 4반", rate: 94 },
  { className: "2학년 1반", rate: 87 },
  { className: "2학년 2반", rate: 90 },
  { className: "2학년 3반", rate: 85 },
  { className: "2학년 4반", rate: 89 },
  { className: "3학년 1반", rate: 95 },
  { className: "3학년 2반", rate: 93 },
  { className: "3학년 3반", rate: 91 },
  { className: "3학년 4반", rate: 89 },
]

// 최근 출석 현황 샘플
export const mockRecentClassAttendance = [
  {
    className: "1학년 2반",
    totalStudents: 30,
    days: [
      { date: "2025-03-14", attendance: 28 },
      { date: "2025-03-13", attendance: 27 },
      { date: "2025-03-12", attendance: 29 },
      { date: "2025-03-11", attendance: 26 },
      { date: "2025-03-10", attendance: 28 },
    ],
  },
  {
    className: "2학년 3반",
    totalStudents: 32,
    days: [
      { date: "2025-03-14", attendance: 30 },
      { date: "2025-03-13", attendance: 29 },
      { date: "2025-03-12", attendance: 28 },
      { date: "2025-03-11", attendance: 31 },
      { date: "2025-03-10", attendance: 30 },
    ],
  },
  {
    className: "3학년 1반",
    totalStudents: 28,
    days: [
      { date: "2025-03-14", attendance: 27 },
      { date: "2025-03-13", attendance: 26 },
      { date: "2025-03-12", attendance: 28 },
      { date: "2025-03-11", attendance: 27 },
      { date: "2025-03-10", attendance: 25 },
    ],
  },
]

// 승인 대기 중인 출석부 샘플
export const mockPendingApprovals = [
  {
    id: "ATT-1001",
    date: "2025-03-14",
    day: "금",
    className: "1학년 2반",
    period: "1차시",
    attendanceCount: 29,
    totalStudents: 32,
    submittedBy: "이반장",
    status: "대기중",
  },
  {
    id: "ATT-1002",
    date: "2025-03-14",
    day: "금",
    className: "1학년 2반",
    period: "2차시",
    attendanceCount: 28,
    totalStudents: 32,
    submittedBy: "이반장",
    status: "대기중",
  },
]

