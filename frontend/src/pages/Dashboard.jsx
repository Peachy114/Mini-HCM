// import { useAuth } from "@/context/AuthContext";
// import { useEffect, useState } from "react";
// import api from "@/utils/api";
// import HistoryTable from "@/pages/admin/reports/HistoryTable";
// import { minsToHrsMins } from "@/utils/helper";

// export default function Dashboard() {
//     const { profile, logout  } = useAuth();

//     const [todayRecord, setTodayRecord] = useState(null);
//     const [summary, setSummary] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [busy, setBusy] = useState(false);
//     const [message, setMessage] = useState({ type: '', text: ''});

//     useEffect(() => {
//         fetchTodayData();
//     }, []);

//     async function fetchTodayData() {
//         try {
//             setLoading(true);
//             const [todayRes, summaryRes] = await Promise.all([
//                 api.get('/attendance/today'),
//                 api.get('/attendance/summary/today'),
//             ]);
//             setTodayRecord(todayRes.data);
//             setSummary(summaryRes.data);
//         } catch (err) {
//             console.error(err.message);
//         } finally {
//             setLoading(false);
//         }
//     }

//     async function handlePunchIn() {
//         setBusy(true);
//         setMessage({ type: '', text: ''});
//         try {
//             await api.post('/attendance/punch-in');
//             setMessage({ type: 'ok', text: 'Punched in successfully'});
//             fetchTodayData();
//         } catch (err) {
//             setMessage({ type: 'err', text: err.response?.data?.error || err.message });
//         } finally {
//             setBusy(false);
//         }
//     }

//     async function handlePunchOut() {
//         setBusy(true);
//         setMessage({ type: '', text: '' });
//         try {
//             await api.post('/attendance/punch-out');
//             setMessage({ type: 'ok', text: 'Punched out successfully!' });
//             fetchTodayData();
//         } catch(err) {
//             setMessage({ type: 'err', text: err.response?.data?.error || err.message });
//         } finally {
//             setBusy(false);
//         }
//     }

//     const isPunchedIn = todayRecord?.status === 'open';
//     const sched = profile?.schedule || { start:'09:00', end: '18:00'};
//     if (loading) return <p>Loading ...</p>

//     return (
//        <div>
//             <h1>Employee Dashboard</h1>
//             <p>Welcome, <strong>{profile?.name}</strong></p>
//             <p>Shift: {sched.start} – {sched.end}</p>
//             <hr />

//             {/* Message */}
//             {message.text && (
//                 <p style={{ color: message.type === 'ok' ? 'green' : 'red' }}>
//                 {message.text}
//                 </p>
//             )}

//             {/* Punch Buttons */}
//             <div>
//                 <button
//                 onClick={handlePunchIn}
//                 disabled={isPunchedIn || busy}
//                 >
//                 Punch In
//                 </button>

//                 <button
//                 onClick={handlePunchOut}
//                 disabled={!isPunchedIn || busy}
//                 style={{ marginLeft: 12 }}
//                 >
//                 Punch Out
//                 </button>
//             </div>

//             <p>
//                 Status: <strong>{isPunchedIn ? 'Punched In' : 'Not Punched In'}</strong>
//                 {isPunchedIn && todayRecord?.punchIn && (
//                 <span> since {new Date(todayRecord.punchIn._seconds * 1000).toLocaleTimeString()}</span>
//                 )}
//             </p>

//             <hr />

//             {/* Today's Summary */}
//             <h2>Today's Summary</h2>
//             {summary ? (
//                 <table border="1" cellPadding="8">
//                 <tbody>
//                     <tr>
//                     <td>Regular Hours</td>
//                     <td><strong>{summary.regularHours} hrs</strong></td>
//                     </tr>
//                     <tr>
//                     <td>Overtime (OT)</td>
//                     <td><strong>{summary.overtimeHours} hrs</strong></td>
//                     </tr>
//                     <tr>
//                     <td>Night Differential (ND)</td>
//                     <td><strong>{summary.nightDiffHours} hrs</strong></td>
//                     </tr>
//                     <tr>
//                     <td>Late</td>
//                     <td><strong>{minsToHrsMins(summary.lateMinutes)}</strong></td>
//                     </tr>
//                     <tr>
//                     <td>Undertime</td>
//                     <td><strong>{minsToHrsMins(summary.undertimeMinutes)}</strong></td>
//                     </tr>
//                     <tr>
//                     <td>Total Worked</td>
//                     <td><strong>{summary.totalWorkedHours} hrs</strong></td>
//                     </tr>
//                 </tbody>
//                 </table>
//             ) : (
//                 <p>No summary yet. Punch in and out to generate data.</p>
//             )}

//             <hr />

//             {/* History */}
//             <HistoryTable />

//             <br />
//             <button onClick={logout}>Logout</button>
//         </div>
//     )
// }


// THIS IS FOR EMPLOYEEEEEEEEEEE DASHBOARDDD================================
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import HistoryTable from "@/pages/admin/reports/HistoryTable";
import { minsToHrsMins } from "@/utils/helper";
import { useActionState } from "@/hooks/useActionState";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon buckle up";
  return "Good evening";
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-5 hover:border-stone-200 transition-all">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-400 mb-2">{label}</p>
      <p className="text-2xl font-bold text-stone-900">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();

  const [todayRecord, setTodayRecord] = useState(null);
  const [summary,     setSummary]     = useState(null);
  const [loading,     setLoading]     = useState(true);

  const [punchState, { setLoading: setPunchBusy, setError: setPunchError, clearError }] =
    useActionState({});

  useEffect(() => { fetchTodayData(); }, []);

  async function fetchTodayData() {
    try {
      setLoading(true);
      const [todayRes, summaryRes] = await Promise.all([
        api.get("/attendance/today"),
        api.get("/attendance/summary/today"),
      ]);
      setTodayRecord(todayRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePunchIn() {
    setPunchBusy(true);
    setPunchError('');
    try {
      await api.post("/attendance/punch-in");
      fetchTodayData();
    } catch (err) {
      setPunchError(err.response?.data?.error || err.message);
    } finally {
      setPunchBusy(false);
    }
  }

  async function handlePunchOut() {
    setPunchBusy(true);
    setPunchError('');
    try {
      await api.post("/attendance/punch-out");
      fetchTodayData();
    } catch (err) {
      setPunchError(err.response?.data?.error || err.message);
    } finally {
      setPunchBusy(false);
    }
  }

  const isPunchedIn = todayRecord?.status === "open";
  const isDone      = todayRecord?.status === "closed";
  const sched       = profile?.schedule || { start: "09:00", end: "18:00" };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-stone-50">
      <div className="w-5 h-5 rounded-full border-2 border-stone-200 border-t-stone-700 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="px-8 py-10 space-y-8">

        {/* ── Demo Banner ── */}
        <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
          <p className="text-xs font-semibold text-blue-700">
            MiniHCM — Test Demo Environment
          </p>
        </div>

        {/* ── Header ── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-2">
            {new Date().toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight mb-1">
            {getGreeting()}, {profile?.name}
          </h1>
          <p className="text-sm text-stone-400">
            Your shift today is{" "}
            <span className="text-stone-700 font-semibold">{sched.start} – {sched.end}</span>
          </p>
        </div>

        <hr className="border-stone-100" />

        {/* ── Error Message ── */}
        {punchState.error && (
          <div className="text-xs font-semibold px-4 py-3 rounded-xl border bg-red-50 border-red-100 text-red-600">
            {punchState.error}
          </div>
        )}

        {/* ── Punch Card ── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-3">
            Attendance
          </p>
          <div className="bg-white border border-stone-100 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

            {/* Status */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isPunchedIn ? "bg-blue-50" : "bg-stone-50"
              }`}>
                {isPunchedIn ? (
                  <svg width="16" height="16" fill="none" stroke="#3b82f6" strokeWidth="2.2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                ) : isDone ? (
                  <svg width="16" height="16" fill="none" stroke="#a8a29e" strokeWidth="2.2" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" fill="none" stroke="#a8a29e" strokeWidth="2.2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-stone-800">
                    {isDone ? "Done for today" : isPunchedIn ? "Currently clocked in" : "Not clocked in"}
                  </p>
                  {isPunchedIn && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  )}
                </div>
                {isPunchedIn && todayRecord?.punchIn && (
                  <p className="text-xs text-stone-400 font-mono">
                    Since {new Date(todayRecord.punchIn._seconds * 1000)
                      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
                {isDone && <p className="text-xs text-stone-400">Attendance recorded for today</p>}
                {!isPunchedIn && !isDone && <p className="text-xs text-stone-400">Clock in to start your shift</p>}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handlePunchIn}
                disabled={isPunchedIn || isDone || punchState.loading}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-stone-900 text-white hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {punchState.loading && !isPunchedIn ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Clocking...
                  </span>
                ) : "Clock In"}
              </button>
              <button
                onClick={handlePunchOut}
                disabled={!isPunchedIn || punchState.loading}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {punchState.loading && isPunchedIn ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
                    Clocking...
                  </span>
                ) : "Clock Out"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Today's Summary ── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-3">
            Today's Summary
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard label="Regular"    value={`${summary?.regularHours    ?? 0} hrs`} />
            <StatCard label="Overtime"   value={`${summary?.overtimeHours   ?? 0} hrs`} />
            <StatCard label="Night Diff" value={`${summary?.nightDiffHours  ?? 0} hrs`} />
            <StatCard label="Late"       value={minsToHrsMins(summary?.lateMinutes      ?? 0)} />
            <StatCard label="Undertime"  value={minsToHrsMins(summary?.undertimeMinutes ?? 0)} />
            <StatCard label="Total"      value={`${summary?.totalWorkHours  ?? 0} hrs`} />
          </div>
        </div>

        {/* ── History ── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-3">
            Attendance History
          </p>
          <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden">
            <HistoryTable />
          </div>
        </div>

      </div>
    </div>
  );
}