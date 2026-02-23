import { formatInTimeZone } from 'date-fns-tz';
const TZ = 'Asia/Manila';

export function todayString() {
  return formatInTimeZone(new Date(), TZ, 'yyyy-MM-dd');
}

export function dateToString(d) {
  return formatInTimeZone(d, TZ, 'yyyy-MM-dd');
}

//hard to visual this
export function getMondayString() {
  const d    = new Date();
  const day  = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return formatInTimeZone(d, TZ, 'yyyy-MM-dd');
}

export function round2(n) {
  return Math.round(n * 100) / 100;
}