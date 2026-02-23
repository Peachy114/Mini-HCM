import { minutesToHours } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
const TZ = 'Asia/Manila';

export function minsToHrsMins(mins) {
  if (!mins || mins === 0) return '0m';
  const h = minutesToHours(mins); 
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function todayString() {
  return formatInTimeZone(new Date(), TZ, 'yyyy-MM-dd');
}

export function formatTime(ts) {
  if (!ts) return '—';
  const d = ts._seconds ? new Date(ts._seconds * 1000) : new Date(ts);
  return d.toLocaleTimeString();
}

export function getMondayString() {
  const d    = new Date();
  const day  = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return formatInTimeZone(d, TZ, 'yyyy-MM-dd');
}
