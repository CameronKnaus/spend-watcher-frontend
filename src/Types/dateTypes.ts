type Year = `${number}${number}${number}${number}`;
type Month = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | '10' | '11' | '12';
type Day = `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}` | `${1 | 2}${number}` | '30' | '31';

// For use with Database interactions
export type DbDate = `${Year}-${Month}-${Day}`;
export const dbDateFormat = 'yyyy-MM-dd';

export type MonthYearDbDate = `${Year}-${Month}`;

export type MonthYearDate = `${Month}/${Year}`; // TODO: Deprecate this in favor of MonthYearDbDate
export const MonthYearDateFormat = 'MM/YYYY';
