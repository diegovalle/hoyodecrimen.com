import { format } from "d3-format";

type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type YYYY = `19${zeroToNine}${zeroToNine}` | `20${zeroToNine}${zeroToNine}`;
type MM = `0${oneToNine}` | `1${0 | 1 | 2}`;
type DD = `${0}${oneToNine}` | `${1 | 2}${zeroToNine}` | `3${0 | 1}`;
type RawDateString = `${YYYY}-${MM}${DD}`;
type RawDateMonthString = `${YYYY}-${MM}`;

export function YYYYmmddToDate15(str: RawDateString | RawDateMonthString) {
  let date_components = str.split("-");
  let month = Number(date_components[1]).toString().padStart(2, "0");
  let date = new Date(
    date_components[0] + "-" + month + "-15T00:00:00.000-06:00"
  );
  return date;
}

export function YYYYmToDate15(y: number, m: number) {
  // js months start at 0, since it is specified as an
  // integer, we need to add 1
  return YYYYmmddToDate15(
    y.toString() + "-" + (m + 1).toString().padStart(2, "0")
  );
}

export function addMonths(d: date, i: number) {
  return new Date(d.setMonth(d.getMonth() + i));
}

// return e.g. ene 2020 or jan 2020
export function getMonthYear(
  d: Date,
  locale: string,
  month: string,
  sep: string
) {
  let date = new Date(d);
  let dateStr = [
    date.toLocaleString(locale, {
      month: month,
      timeZone: "UTC",
    }),
    date.getFullYear(),
  ].join(sep);
  return dateStr;
}

export function dateTommYYYY(value: Date, locale: str) {
  var date = new Date(value);
  return [
    date.toLocaleString(locale, { month: month, timezone: "UTC" }),
    date.getFullYear(),
  ].join("\n");
}

export function mmddToLocale(locale, start_date: string) {
  return [
    YYYYmmddToDate15(start_date).toLocaleString(locale, {
      month: "short",
    }),
    YYYYmmddToDate15(start_date).getFullYear(),
  ].join(`\n`);
}

export function dateRange(startDate: Date, endDate: Date) {
  // we use UTC methods so that timezone isn't considered
  let start = new Date(startDate);
  const end = new Date(endDate).setUTCHours(12);
  const dates = [];
  while (start <= end) {
    // compensate for zero-based months in display
    const displayMonth = start.getUTCMonth() + 1;
    dates.push(
      new Date(
        [
          start.getUTCFullYear(),
          // months are zero based, ensure leading zero
          displayMonth.toString().padStart(2, "0"),
          // always display the first of the month
          "15",
        ].join("-")
      )
    );

    // progress the start date by one month
    start = new Date(start.setUTCMonth(displayMonth));
  }

  return dates;
}

// Convert a number to a day of the week
// Same as Postgres's dow()
// 0=Sunday, 1=Monday, 2=Tuesday, ... 6=Saturday
export function dayToLocale(locale: string, weekday: string, day: number) {
  const dummyDate = new Date(
    "2023-01-" +
      (parseInt(day) + 1).toString().padStart(2, "0") +
      "T12:00:00.000+00:00"
  );
  return dummyDate.toLocaleDateString(locale, {
    weekday: weekday,
    timeZone: "UTC",
  });
}

export function YYYYmmddArrayToDate(arr) {
  return arr.map((item) => YYYYmmddToDate15(item));
}

export function YYYYmmToStr(str: string, language: string) {
  return [
    new Date(YYYYmmddToDate15(str)).toLocaleString(language, {
      month: "short",
    }),
    new Date(YYYYmmddToDate15(str)).getFullYear(),
  ].join(`\n`);
}

export const axisLabel = {
  fontFamily: "Roboto Condensed, Ubuntu, system-ui, sans-serif",
  fontSize: 12,
  color: "#4d4d4d",
};

export const nameTextStyle = {
  fontFamily: "Roboto Condensed, Ubuntu, system-ui, sans-serif",
  fontSize: 18,
  color: "#222",
};

export const comma = format(",");
export const noDecimal = format(".0f");
export const commaNoDecimal = format(",.0f");

export function round1(num: number) {
  return Math.round(num * 10) / 10;
}

export function round0(num: number) {
  return Math.round(num);
}

export function round4(num: number) {
  return Math.round(num * 10000) / 10000;
}
export function round5(num: number) {
  return Math.round(num * 100000) / 100000;
}

export function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

export function annualizeRate(
  count: string | Number,
  date: string,
  population: string | Number
): number {
  const c: Number = +count;
  const p: Number = +population;
  return (
    (((c / daysInMonth(date.substr(5, 6), date.substr(0, 4))) * 30) / p) *
    100000 *
    12
  );
}
