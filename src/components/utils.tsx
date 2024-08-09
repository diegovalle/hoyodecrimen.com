import { format } from "d3-format";

type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type YYYY = `19${zeroToNine}${zeroToNine}` | `20${zeroToNine}${zeroToNine}`;
type MM = `0${oneToNine}` | `1${0 | 1 | 2}`;
type DD = `${0}${oneToNine}` | `${1 | 2}${zeroToNine}` | `3${0 | 1}`;
type RawDateString = `${YYYY}-${MM}${DD}`;
type RawDateMonthString = `${YYYY}-${MM}`;

export function YYYYmmddToDate15(str: RawDateString | RawDateMonthString) {
  let date = new Date();

  let date_components = str.split("-");
  date.setDate(15);
  date.setFullYear(date_components[0]);
  // js months start at 0
  date.setMonth(date_components[1] - 1);
  return date;
}

export function YYYYmmddArrayToDate(arr) {
  return arr.map((item) => YYYYmmddToDate15(item));
}

export function YYYYmmToStr(str: string, language: string) {
  return [
    new Date(str + "-15").toLocaleString(language, { month: "short" }),
    new Date(str + "-15").getFullYear(),
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
