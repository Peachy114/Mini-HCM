// import { useState, useEffect } from "react";
// import api from "@/utils/api";
// import { Link } from "react-router-dom";
// import { minsToHrsMins, formatTime, todayString} from "@/utils/helper";
// import EditPunchModal from "@/pages/admin/reports/EditPunchModal";



// export default function DailyReport() {
//   const [date,       setDate]       = useState(todayString());
//   const [report,     setReport]     = useState([]);
//   const [attendance, setAttendance] = useState([]);
//   const [loading,    setLoading]    = useState(false);
//   const [error,      setError]      = useState('');
//   const [editModal,  setEditModal]  = useState(null);

//   useEffect(() => {
//     fetchAll();
//   }, [date]);

//   async function fetchAll() {
//     setLoading(true);
//     setError('');
//     try {
//       const [reportRes, attendanceRes] = await Promise.all([
//         api.get(`/admin/reports/daily?date=${date}`),
//         api.get(`/admin/reports/attendance?date=${date}`),
//       ]);
//       setReport(reportRes.data);
//       setAttendance(attendanceRes.data);
//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleEditSave(id, punchIn, punchOut) {
//     try {
//       await api.patch(`/admin/reports/attendance/${id}`, { punchIn, punchOut });
//       setEditModal(null);
//       fetchAll();
//     } catch (err) {
//       alert(err.response?.data?.error || err.message);
//     }
//   }

//   return (
//     <div>
//       <h1>Daily Report</h1>
//       <Link to="/admin/dashboard">← Back</Link>
//       <br /><br />

//       <div>
//         <label>Select Date: </label>
//         <input
//           type="date"
//           value={date}
//           onChange={e => setDate(e.target.value)}
//         />
//       </div>
//       <br />

//       {error   && <p style={{ color: 'red' }}>{error}</p>}
//       {loading && <p>Loading...</p>}

//       {/* LOGIN / LOGOUT LOG */}
//       <h2>Login / Logout Log</h2>
//       {!loading && attendance.length === 0 && <p>No punch records for {date}.</p>}
//       {!loading && attendance.length > 0 && (
//         <table border="1" cellPadding="8">
//           <thead>
//             <tr>
//               <th>Employee Name</th>
//               <th>Email</th>
//               <th>Login Time</th>
//               <th>Logout Time</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attendance.map(row => (
//               <tr key={row.id}>
//                 <td>{row.name}</td>
//                 <td>{row.email}</td>
//                 <td>{formatTime(row.punchIn)}</td>
//                 <td>{row.punchOut ? formatTime(row.punchOut) : '—'}</td>
//                 <td>{row.status === 'open' ? '🟢 Logged In' : '🔴 Logged Out'}</td>
//                 <td>
//                   <button onClick={() => setEditModal(row)}>Edit</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <br />

//       {/* METRICS SUMMARY */}
//       <h2>Metrics Summary</h2>
//       {!loading && report.length === 0 && <p>No summary data for {date}.</p>}
//       {!loading && report.length > 0 && (
//         <table border="1" cellPadding="8">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Scheduled</th>
//               <th>Punch In</th>
//               <th>Punch Out</th>
//               <th>Regular</th>
//               <th>OT</th>
//               <th>Night Diff</th>
//               <th>Late</th>
//               <th>Undertime</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {report.map(row => (
//               <tr key={row.id}>
//                 <td>{row.name}</td>
//                 <td>{row.scheduledStart} – {row.scheduledEnd}</td>
//                 <td>{formatTime(row.punchIn)}</td>
//                 <td>{row.punchOut ? formatTime(row.punchOut) : '—'}</td>
//                 <td>{row.regularHours} hrs</td>
//                 <td>{row.overtimeHours} hrs</td>
//                 <td>{row.nightDiffHours} hrs</td>
//                 <td>{minsToHrsMins(Math.floor(row.lateMinutes))}</td>
//                 <td>{minsToHrsMins(Math.floor(row.undertimeMinutes))}</td>
//                 <td>{row.totalWorkHours} hrs</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {editModal && (
//         <EditPunchModal
//           record={editModal}
//           onSave={handleEditSave}
//           onClose={() => setEditModal(null)}
//         />
//       )}
//     </div>
//   );
// }
// ==================================COMMENT AR TOP FOR EASY DEBUGGING-===================================

import { useState, useEffect } from "react";
import api from "@/utils/api";
import { minsToHrsMins, formatTime, todayString } from "@/utils/helper";
import EditPunchModal from "@/pages/admin/reports/EditPunchModal";

export default function DailyReport() {
  const [date,       setDate]       = useState(todayString());
  const [report,     setReport]     = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [editModal,  setEditModal]  = useState(null);

  useEffect(() => { fetchAll(); }, [date]);

  async function fetchAll() {
    setLoading(true); setError('');
    try {
      const [reportRes, attendanceRes] = await Promise.all([
        api.get(`/admin/reports/daily?date=${date}`),
        api.get(`/admin/reports/attendance?date=${date}`),
      ]);
      setReport(reportRes.data);
      setAttendance(attendanceRes.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEditSave(id, punchIn, punchOut) {
    try {
      await api.patch(`/admin/reports/attendance/${id}`, { punchIn, punchOut });
      setEditModal(null);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-2">Reports</p>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 mb-1">Daily Report</h1>
            <p className="text-stone-400 text-sm">Attendance logs and computed metrics for a specific date.</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-stone-500 whitespace-nowrap">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-700 bg-white focus:outline-none focus:border-stone-400"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-stone-100 mb-8" />

      {error && (
        <div className="text-sm text-red-500 bg-red-50 rounded-2xl px-4 py-3 mb-6">{error}</div>
      )}

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 rounded-full border-2 border-stone-200 border-t-stone-600 animate-spin" />
        </div>
      )}

      {!loading && (<>

        {/* LOGIN / LOGOUT LOG */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Login / Logout Log</p>
            <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-semibold">{attendance.length}</span>
          </div>

          {attendance.length === 0 ? (
            <p className="text-sm text-stone-400">No punch records for {date}.</p>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    {["Employee", "Email", "Clock In", "Clock Out", "Status", ""].map((h, i) => (
                      <th key={i} className="text-left text-xs font-semibold uppercase tracking-wider text-stone-400 px-5 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((row, i) => (
                    <tr key={row.id} className={`hover:bg-stone-50/60 transition-colors ${i !== attendance.length - 1 ? 'border-b border-stone-100' : ''}`}>
                      <td className="px-5 py-3 font-semibold text-stone-800">{row.name}</td>
                      <td className="px-5 py-3 text-stone-400 text-xs">{row.email}</td>
                      <td className="px-5 py-3 font-mono text-xs text-stone-600">{formatTime(row.punchIn)}</td>
                      <td className="px-5 py-3 font-mono text-xs text-stone-500">{row.punchOut ? formatTime(row.punchOut) : '—'}</td>
                      <td className="px-5 py-3">
                        {row.status === 'open' ? (
                          <span className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-semibold">Active</span>
                        ) : (
                          <span className="text-xs bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full font-semibold">Closed</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setEditModal(row)}
                          className="text-xs text-stone-400 hover:text-stone-800 border border-stone-200 hover:border-stone-400 px-3 py-1 rounded-lg transition-colors font-medium"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* METRICS SUMMARY */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">Metrics Summary</p>
            <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full font-semibold">{report.length}</span>
          </div>

          {report.length === 0 ? (
            <p className="text-sm text-stone-400">No summary data for {date}.</p>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    {["Name", "Scheduled", "In", "Out", "Regular", "OT", "Night Diff", "Late", "Undertime", "Total"].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-stone-400 px-5 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.map((row, i) => (
                    <tr key={row.id} className={`hover:bg-stone-50/60 transition-colors ${i !== report.length - 1 ? 'border-b border-stone-100' : ''}`}>
                      <td className="px-5 py-3 font-semibold text-stone-800 whitespace-nowrap">{row.name}</td>
                      <td className="px-5 py-3">
                        <span className="font-mono text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-lg">
                          {row.scheduledStart} – {row.scheduledEnd}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-stone-600">{formatTime(row.punchIn)}</td>
                      <td className="px-5 py-3 font-mono text-xs text-stone-500">{row.punchOut ? formatTime(row.punchOut) : '—'}</td>
                      <td className="px-5 py-3 text-stone-700">{row.regularHours}<span className="text-stone-400 text-xs ml-0.5">h</span></td>
                      <td className="px-5 py-3 text-stone-700">{row.overtimeHours}<span className="text-stone-400 text-xs ml-0.5">h</span></td>
                      <td className="px-5 py-3 text-stone-700">{row.nightDiffHours}<span className="text-stone-400 text-xs ml-0.5">h</span></td>
                      <td className="px-5 py-3">
                        {row.lateMinutes > 0
                          ? <span className="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full font-medium">{minsToHrsMins(Math.floor(row.lateMinutes))}</span>
                          : <span className="text-stone-300">—</span>}
                      </td>
                      <td className="px-5 py-3">
                        {row.undertimeMinutes > 0
                          ? <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full font-medium">{minsToHrsMins(Math.floor(row.undertimeMinutes))}</span>
                          : <span className="text-stone-300">—</span>}
                      </td>
                      <td className="px-5 py-3 font-bold text-stone-800">{row.totalWorkHours}<span className="text-stone-400 text-xs ml-0.5 font-normal">h</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>)}

      {editModal && (
        <EditPunchModal record={editModal} onSave={handleEditSave} onClose={() => setEditModal(null)} />
      )}
    </div>
  );
}