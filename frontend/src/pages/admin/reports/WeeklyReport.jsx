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

function getShiftType(start) {
  const h = parseInt(start?.split(':')[0] ?? '9');
  if (h >= 22 || h < 6) return { label: 'Night Shift',     color: 'bg-indigo-50 text-indigo-600' };
  if (h >= 14)          return { label: 'Afternoon Shift', color: 'bg-amber-50 text-amber-600' };
  return                       { label: 'Day Shift',       color: 'bg-emerald-50 text-emerald-600' };
}

function buildWeekDays(weekStart, dailyBreakdown) {
  const map = {};
  dailyBreakdown.forEach(d => { map[d.date] = d; });
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const key = date.toISOString().split('T')[0];
    return { date: key, dayLabel: DAY_LABELS[i], data: map[key] || null };
  });
}

function StatBox({ label, value, color }) {
  return (
    <div className="bg-stone-50 rounded-xl px-3 py-2.5 border border-stone-100">
      <p className="text-xs text-stone-400 mb-1">{label}</p>
      <p className={`text-sm font-semibold ${color || 'text-stone-700'}`}>{value}</p>
    </div>
  );
}

function DayRow({ label, value, bold, color }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-stone-400">{label}</span>
      <span className={`text-xs ${bold ? 'font-bold text-stone-800' : `font-medium ${color || 'text-stone-600'}`}`}>{value}</span>
    </div>
  );
}

export default function WeeklyReport() {
  const [weekStart, setWeekStart] = useState(getMondayString());
  const [report,    setReport]    = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [expanded,  setExpanded]  = useState(null);

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

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Reports</p>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 mb-1">Weekly Report</h1>
            <p className="text-stone-400 text-sm">Aggregated hours per employee for the selected week.</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-stone-500 whitespace-nowrap">Week Start (Mon)</label>
            <input
              type="date"
              value={weekStart}
              onChange={e => setWeekStart(e.target.value)}
              className="border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-700 bg-white focus:outline-none focus:border-stone-400"
            />
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
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Employees</p>
            <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-semibold">{report.length}</span>
          </div>

          {report.map(row => {
            const schedStart = row.dailyBreakdown?.[0]?.scheduledStart;
            const schedEnd   = row.dailyBreakdown?.[0]?.scheduledEnd;
            const shift      = getShiftType(schedStart);
            const isExpanded = expanded === row.userId;
            const weekDays   = buildWeekDays(weekStart, row.dailyBreakdown);

            return (
              <div key={row.userId} className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                <div className="p-5">

                  {/* Employee header */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-stone-600 shrink-0">
                        {row.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-stone-800">{row.name}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${shift.color}`}>
                            {shift.label}
                          </span>
                          {schedStart && schedEnd && (
                            <span className="font-mono text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-lg">
                              {schedStart} – {schedEnd}
                            </span>
                          )}
                          <span className="text-xs text-stone-400">
                            {row.daysPresent} day{row.daysPresent !== 1 ? 's' : ''} present
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpanded(isExpanded ? null : row.userId)}
                      className="text-xs text-stone-400 hover:text-stone-700 border border-stone-200 hover:border-stone-400 px-3 py-1.5 rounded-xl transition-colors font-medium shrink-0"
                    >
                      {isExpanded ? 'Hide Days' : 'Show Days'}
                    </button>
                  </div>

                  {/* Weekly totals */}
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    <StatBox label="Regular"    value={`${row.totalRegularHours}h`} />
                    <StatBox label="Overtime"   value={`${row.totalOvertimeHours}h`} />
                    <StatBox label="Night Diff" value={`${row.totalNightDiffHours}h`} />
                    <StatBox
                      label="Late"
                      value={row.totalLateMinutes > 0 ? minsToHrsMins(Math.floor(row.totalLateMinutes)) : '—'}
                      color={row.totalLateMinutes > 0 ? 'text-orange-500' : 'text-stone-400'}
                    />
                    <StatBox
                      label="Undertime"
                      value={row.totalUndertimeMinutes > 0 ? minsToHrsMins(Math.floor(row.totalUndertimeMinutes)) : '—'}
                      color={row.totalUndertimeMinutes > 0 ? 'text-red-500' : 'text-stone-400'}
                    />
                    <StatBox label="Total" value={`${row.totalWorkHours}h`} color="text-stone-900 font-bold" />
                  </div>
                </div>

                {/* Daily breakdown */}
                {isExpanded && (
                  <div className="border-t border-stone-100 bg-stone-50 px-5 py-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">Daily Breakdown</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {weekDays.map(({ date, dayLabel, data }) => (
                        <div key={date} className={`rounded-xl border p-3.5 ${data ? 'bg-white border-stone-100' : 'bg-stone-100/50 border-stone-100'}`}>
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-xs font-bold text-stone-700">{dayLabel}</span>
                            <span className="font-mono text-xs text-stone-400">{date}</span>
                          </div>
                          {!data ? (
                            <p className="text-xs text-stone-400 italic">No record</p>
                          ) : (
                            <div className="space-y-1.5">
                              <DayRow label="Regular"    value={`${data.regularHours || 0}h`} />
                              <DayRow label="OT"         value={`${data.overtimeHours || 0}h`} />
                              <DayRow label="Night Diff" value={`${data.nightDiffHours || 0}h`} />
                              <DayRow label="Late"       value={(data.lateMinutes||0) > 0 ? minsToHrsMins(Math.floor(data.lateMinutes)) : '—'} color={(data.lateMinutes||0) > 0 ? 'text-orange-500' : 'text-stone-400'} />
                              <DayRow label="Undertime"  value={(data.undertimeMinutes||0) > 0 ? minsToHrsMins(Math.floor(data.undertimeMinutes)) : '—'} color={(data.undertimeMinutes||0) > 0 ? 'text-red-500' : 'text-stone-400'} />
                              <div className="border-t border-stone-100 pt-1.5 mt-1.5">
                                <DayRow label="Total" value={`${data.totalWorkHours || 0}h`} bold />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}