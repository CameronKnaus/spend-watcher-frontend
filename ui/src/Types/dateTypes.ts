// This is just tech debt at this point.  Represents YYYY-MM-DD string.
export type DbDate = string;
export const dbDateFormat = 'yyyy-MM-dd';

// This is also tech debt.  Huge mistake.  Remapped to string and represents a YYYY-MM string.
export type MonthYearDbDate = string;
export const monthYearDbDateFormat = 'yyyy-MM';
