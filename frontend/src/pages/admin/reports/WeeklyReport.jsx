// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import api from "@/utils/api";
// import { minsToHrsMins, getMondayString } from "@/utils/helper";

// export default function WeeklyReport() {
//   const [weekStart, setWeekStart] = useState(getMondayString());
//   const [report,    setReport]    = useState([]);
//   const [loading,   setLoading]   = useState(false);
//   const [error,     setError]     = useState('');
//   const [expanded,  setExpanded]  = useState(null); // userId for expanded row

//   useEffect(() => {
//     fetchReport();
//   }, [weekStart]);

//   async function fetchReport() {
//     setLoading(true);
//     setError('');
//     try {
//       const res = await api.get(`/admin/reports/weekly?weekStart=${weekStart}`);
//       setReport(res.data);
//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div>
//       <h1>Weekly Report</h1>
//       <Link to="/admin/dashboard">← Back</Link>
//       <br /><br />

//       <div>
//         <label>Week Start (Monday): </label>
//         <input
//           type="date"
//           value={weekStart}
//           onChange={e => setWeekStart(e.target.value)}
//         />
//       </div>
//       <br />

//       {error   && <p style={{ color: 'red' }}>{error}</p>}
//       {loading && <p>Loading...</p>}

//       {!loading && report.length === 0 && (
//         <p>No data for this week.</p>
//       )}

//       {!loading && report.length > 0 && (
//         <table border="1" cellPadding="8">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Days Present</th>
//               <th>Total Regular</th>
//               <th>Total OT</th>
//               <th>Total Night Diff</th>
//               <th>Total Late</th>
//               <th>Total Undertime</th>
//               <th>Total Worked</th>
//               <th>Details</th>
//             </tr>
//           </thead>
//           <tbody>
//             {report.map(row => (
//               <>
//                 <tr key={row.userId}>
//                   <td><strong>{row.name}</strong></td>
//                   <td>{row.daysPresent} days</td>
//                   <td>{row.totalRegularHours} hrs</td>
//                   <td>{row.totalOvertimeHours} hrs</td>
//                   <td>{row.totalNightDiffHours} hrs</td>
//                   <td>{minsToHrsMins(row.totalLateMinutes)}</td>
//                   <td>{minsToHrsMins(row.totalUndertimeMinutes)}</td>
//                   <td>{row.totalWorkHours} hrs</td>
//                   <td>
//                     <button onClick={() =>
//                       setExpanded(expanded === row.userId ? null : row.userId)
//                     }>
//                       {expanded === row.userId ? 'Hide' : 'Show'} Daily
//                     </button>
//                   </td>
//                 </tr>

//                 {/* Daily breakdown row */}
//                 {expanded === row.userId && (
//                   <tr key={`${row.userId}-breakdown`}>
//                     <td colSpan="9" style={{ background: '#f9f9f9' }}>
//                       <table border="1" cellPadding="6" style={{ width: '100%' }}>
//                         <thead>
//                           <tr>
//                             <th>Date</th>
//                             <th>Regular</th>
//                             <th>OT</th>
//                             <th>Night Diff</th>
//                             <th>Late</th>
//                             <th>Undertime</th>
//                             <th>Total</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {row.dailyBreakdown.map(d => (
//                             <tr key={d.date}>
//                               <td>{d.date}</td>
//                               <td>{d.regularHours    || 0} hrs</td>
//                               <td>{d.overtimeHours   || 0} hrs</td>
//                               <td>{d.nightDiffHours  || 0} hrs</td>
//                               <td>{minsToHrsMins(Math.floor(row.lateMinutes))}</td>
//                               <td>{minsToHrsMins(Math.floor(row.undertimeMinutes))}</td>
//                               <td>{d.totalWorkHours  || 0} hrs</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                 )}
//               </>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }===================================COMMENT FOR EAY DEBUGGING-=========================

import { useState, useEffect } from "react";
import api from "@/utils/api";
import { minsToHrsMins, getMondayString } from "@/utils/helper";

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function getShiftType(start) {
  const h = parseInt(start?.split(':')[0] ?? '9');
  if (h >= 22 || h < 6) return { label: 'Night',     color: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
  if (h >= 14)          return { label: 'Afternoon', color: 'bg-amber-50 text-amber-600 border-amber-100' };
  return                       { label: 'Day',       color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
}

function fmtDate(d) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

function getWeeksInMonth(year, month) {
  const weeks = [];
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);

  let start = new Date(firstDay);
  const dow = start.getDay();
  const diffToMon = dow === 0 ? -6 : 1 - dow;
  start.setDate(start.getDate() + diffToMon);

  let weekNum = 1;
  while (start <= lastDay) {
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const fmt = d => `${d.getMonth() + 1}/${d.getDate()}`;
    weeks.push({
      label:     `Week ${weekNum}  (${fmt(start)} – ${fmt(end)})`,
      mondayStr: fmtDate(start),
    });

    start = new Date(start);
    start.setDate(start.getDate() + 7);
    weekNum++;
  }
  return weeks;
}

function buildCalendarDays(weekStart, report) {
  return Array.from({ length: 7 }, (_, i) => {
    const [year, month, day] = weekStart.split('-').map(Number);
    const date = new Date(year, month - 1, day + i);
    const key  = fmtDate(date);

    const employees = report
      .map(row => {
        const dayData = row.dailyBreakdown?.find(d => d.date === key);
        return dayData ? { ...row, dayData } : null;
      })
      .filter(Boolean);

    return { date: key, dayLabel: DAY_LABELS[i], employees };
  });
}

function EmployeeCard({ row }) {
  const shift    = getShiftType(row.dayData?.scheduledStart);
  const initials = row.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-stone-100 hover:border-stone-200 transition-colors">
      <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-600 shrink-0">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-stone-800 truncate">{row.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${shift.color}`}>
            {shift.label}
          </span>
          <span className="text-[10px] text-stone-400 font-mono">
            {minsToHrsMins(Math.round((row.dayData.totalWorkHours || 0) * 60))}
          </span>
          {(row.dayData.lateMinutes || 0) > 0 && (
            <span className="text-[10px] text-orange-500 font-medium">
              Late {minsToHrsMins(Math.floor(row.dayData.lateMinutes))}
            </span>
          )}
          {(row.dayData.overtimeHours || 0) > 0 && (
            <span className="text-[10px] text-blue-500 font-medium">
              OT {minsToHrsMins(Math.round(row.dayData.overtimeHours * 60))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WeeklyReport() {
  const today = new Date();

  const [selYear,   setSelYear]   = useState(today.getFullYear());
  const [selMonth,  setSelMonth]  = useState(today.getMonth());
  const [selWeek,   setSelWeek]   = useState(0);
  const [weekStart, setWeekStart] = useState(getMondayString());

  const [report,  setReport]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const weeks = getWeeksInMonth(selYear, selMonth);

  useEffect(() => {
    if (weeks[selWeek]) {
      setWeekStart(weeks[selWeek].mondayStr);
    } else {
      setSelWeek(0);
    }
  }, [selYear, selMonth, selWeek]);

  useEffect(() => { fetchReport(); }, [weekStart]);

  async function fetchReport() {
    setLoading(true); setError('');
    try {
      const res = await api.get(`/admin/reports/weekly?weekStart=${weekStart}`);
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  const calendarDays = buildCalendarDays(weekStart, report);
  const yearOptions  = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 3 + i);

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Reports</p>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 mb-1">Weekly Report</h1>
            <p className="text-stone-400 text-sm">Employee attendance by day for the selected week.</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selYear}
              onChange={e => { setSelYear(Number(e.target.value)); setSelWeek(0); }}
              className="border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-700 bg-white focus:outline-none focus:border-stone-400"
            >
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <select
              value={selMonth}
              onChange={e => { setSelMonth(Number(e.target.value)); setSelWeek(0); }}
              className="border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-700 bg-white focus:outline-none focus:border-stone-400"
            >
              {MONTH_NAMES.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>

            <select
              value={selWeek}
              onChange={e => setSelWeek(Number(e.target.value))}
              className="border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-700 bg-white focus:outline-none focus:border-stone-400"
            >
              {weeks.map((w, i) => <option key={i} value={i}>{w.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-100 mb-8" />

      {error && <div className="text-sm text-red-500 bg-red-50 rounded-2xl px-4 py-3 mb-6">{error}</div>}

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-stone-200 border-t-stone-600 animate-spin" />
        </div>
      )}

      {!loading && report.length === 0 && (
        <p className="text-sm text-stone-400">No data for this week.</p>
      )}

      {!loading && report.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {calendarDays.map(({ date, dayLabel, employees }) => {
            const isWeekend = dayLabel === 'Sat' || dayLabel === 'Sun';
            return (
              <div
                key={date}
                className={`rounded-2xl border overflow-hidden ${isWeekend ? 'border-stone-200 bg-stone-50' : 'border-stone-100 bg-white'}`}
              >
                {/* Day header */}
                <div className={`px-4 py-3 flex items-center justify-between border-b ${isWeekend ? 'border-stone-200 bg-stone-100/60' : 'border-stone-100'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-stone-800">{dayLabel}</span>
                    <span className="font-mono text-xs text-stone-400">{date}</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    employees.length > 0 ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-400'
                  }`}>
                    {employees.length}
                  </span>
                </div>

                {/* Employee list */}
                <div className="p-3 space-y-2">
                  {employees.length === 0 ? (
                    <p className="text-xs text-stone-400 italic text-center py-3">No clock-ins</p>
                  ) : (
                    employees.map(row => <EmployeeCard key={row.userId} row={row} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}