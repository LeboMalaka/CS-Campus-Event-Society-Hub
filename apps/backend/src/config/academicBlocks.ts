export type AcademicBlockType = 'EXAM' | 'TEST_WEEK' | 'RECESS' | 'HOLIDAY';

export type AcademicBlock = {
  block_name: string;
  block_type: AcademicBlockType;
  start_date: string;
  end_date: string;
  severity_level: 3;
};

export const academicBlocks2026: AcademicBlock[] = [
  {
    block_name: 'Exit/Special Examination',
    block_type: 'EXAM',
    start_date: '2026-01-26',
    end_date: '2026-01-30',
    severity_level: 3,
  },
  {
    block_name: 'Academic Recess',
    block_type: 'RECESS',
    start_date: '2026-03-30',
    end_date: '2026-04-02',
    severity_level: 3,
  },
  {
    block_name: 'Predicate Evaluation Period',
    block_type: 'TEST_WEEK',
    start_date: '2026-05-18',
    end_date: '2026-05-22',
    severity_level: 3,
  },
  {
    block_name: 'Main Examinations',
    block_type: 'EXAM',
    start_date: '2026-05-25',
    end_date: '2026-06-12',
    severity_level: 3,
  },
  {
    block_name: 'Supplementary Examinations for Semester Modules',
    block_type: 'EXAM',
    start_date: '2026-06-17',
    end_date: '2026-06-30',
    severity_level: 3,
  },
  {
    block_name: 'Academic Recess',
    block_type: 'RECESS',
    start_date: '2026-07-01',
    end_date: '2026-07-10',
    severity_level: 3,
  },
  {
    block_name: 'Exit/Special Examination',
    block_type: 'EXAM',
    start_date: '2026-08-03',
    end_date: '2026-08-07',
    severity_level: 3,
  },
  {
    block_name: 'Academic Recess',
    block_type: 'RECESS',
    start_date: '2026-09-21',
    end_date: '2026-09-23',
    severity_level: 3,
  },
  {
    block_name: 'Heritage Day and TUT Holiday',
    block_type: 'HOLIDAY',
    start_date: '2026-09-24',
    end_date: '2026-09-25',
    severity_level: 3,
  },
  {
    block_name: 'Predicate Evaluation Period',
    block_type: 'TEST_WEEK',
    start_date: '2026-10-26',
    end_date: '2026-10-30',
    severity_level: 3,
  },
  {
    block_name: 'Main Examinations',
    block_type: 'EXAM',
    start_date: '2026-11-02',
    end_date: '2026-11-20',
    severity_level: 3,
  },
  {
    block_name: 'Supplementary Examinations',
    block_type: 'EXAM',
    start_date: '2026-11-23',
    end_date: '2026-12-04',
    severity_level: 3,
  },
  {
    block_name: 'Good Friday',
    block_type: 'HOLIDAY',
    start_date: '2026-04-03',
    end_date: '2026-04-03',
    severity_level: 3,
  },
  {
    block_name: 'Family Day',
    block_type: 'HOLIDAY',
    start_date: '2026-04-06',
    end_date: '2026-04-06',
    severity_level: 3,
  },
  {
    block_name: 'Freedom Day',
    block_type: 'HOLIDAY',
    start_date: '2026-04-27',
    end_date: '2026-04-27',
    severity_level: 3,
  },
  {
    block_name: "Workers' Day",
    block_type: 'HOLIDAY',
    start_date: '2026-05-01',
    end_date: '2026-05-01',
    severity_level: 3,
  },
  {
    block_name: 'TUT Holiday and Youth Day',
    block_type: 'HOLIDAY',
    start_date: '2026-06-15',
    end_date: '2026-06-16',
    severity_level: 3,
  },
  {
    block_name: "National Women's Day observed",
    block_type: 'HOLIDAY',
    start_date: '2026-08-10',
    end_date: '2026-08-10',
    severity_level: 3,
  },
  {
    block_name: 'Day of Reconciliation',
    block_type: 'HOLIDAY',
    start_date: '2026-12-16',
    end_date: '2026-12-16',
    severity_level: 3,
  },
  {
    block_name: 'Christmas and Day of Goodwill',
    block_type: 'HOLIDAY',
    start_date: '2026-12-25',
    end_date: '2026-12-26',
    severity_level: 3,
  },
];

export type AcademicCalendarConflict = AcademicBlock;

function toDate(value: string | Date) {
  if (value instanceof Date) return value;
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00.000Z`)
    : new Date(value);
}

export function checkAcademicCalendarConflict(
  startDate: string | Date,
  endDate: string | Date = startDate
): AcademicCalendarConflict | null {
  const eventStart = toDate(startDate).getTime();
  const eventEnd = toDate(endDate).getTime();

  if (Number.isNaN(eventStart) || Number.isNaN(eventEnd) || eventEnd < eventStart) return null;

  return academicBlocks2026.find((block) => {
    const blockStart = Date.parse(`${block.start_date}T00:00:00.000Z`);
    const blockEnd = Date.parse(`${block.end_date}T23:59:59.999Z`);
    return eventStart <= blockEnd && eventEnd >= blockStart;
  }) || null;
}

export function findAcademicBlocks(startTime: string, endTime?: string | null) {
  const eventStart = new Date(startTime).getTime();
  const eventEnd = new Date(endTime || startTime).getTime();

  if (Number.isNaN(eventStart) || Number.isNaN(eventEnd)) return [];

  return academicBlocks2026.filter((block) => {
    const blockStart = new Date(`${block.start_date}T00:00:00`).getTime();
    const blockEnd = new Date(`${block.end_date}T23:59:59.999`).getTime();
    return eventStart <= blockEnd && eventEnd >= blockStart;
  });
}