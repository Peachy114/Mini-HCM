// import { useEffect, useState } from "react";
// import api from "@/utils/api";
// import { minsToHrsMins } from "@/utils/helper";

// export default function HistoryTable() {
//     const [history, setHistory] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(()=> {
//         api.get('/attendance/history')
//             .then(res => setHistory(res.data))
//             .catch(err => console.error(err.message))
//             .finally(()=> setLoading(false));
//     }, []);

//     if (loading) return <p>Loading ...</p>
//     if (history.length ===0 ) return <p>No history yet.</p>

//     return (
//         <>
//             <h2>History (Last 30 Days)</h2>
//             <table border="1" cellPadding="8">
//                 <thead>
//                 <tr>
//                     <th>Date</th>
//                     <th>Punch In</th>
//                     <th>Punch Out</th>
//                     <th>Regular</th>
//                     <th>OT</th>
//                     <th>Night Diff</th>
//                     <th>Late</th>
//                     <th>Undertime</th>
//                     <th>Total</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {history.map(row => (
//                     <tr key={row.id}>
//                     <td>{row.date}</td>
//                     <td>{row.punchIn  ? new Date(row.punchIn._seconds  * 1000).toLocaleTimeString() : '—'}</td>
//                     <td>{row.punchOut ? new Date(row.punchOut._seconds * 1000).toLocaleTimeString() : '—'}</td>
//                     <td>{row.regularHours} hrs</td>
//                     <td>{row.overtimeHours} hrs</td>
//                     <td>{row.nightDiffHours} hrs</td>
//                     <td>{minsToHrsMins(Math.floor(row.lateMinutes))}</td>
//                     <td>{minsToHrsMins(Math.floor(row.undertimeMinutes))}</td>
//                     <td>{row.totalWorkHours} hrs</td>
//                     </tr>
//                 ))}
//                 </tbody>
//             </table>
//         </>
//     )
// }

import { useEffect, useState } from "react";
import api from "@/utils/api";
import { minsToHrsMins } from "@/utils/helper";

function TimeCell({ ts }) {
  if (!ts) return <span className="text-stone-300">—</span>;
  return (
    <span className="font-mono text-xs text-stone-500">
      {new Date(ts._seconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

function Pill({ value, color }) {
  if (!value) return <span className="text-stone-300">—</span>;
  const colors = {
    orange: "bg-orange-50 text-orange-500",
    red:    "bg-red-50 text-red-500",
    blue:   "bg-blue-50 text-blue-500",
    violet: "bg-violet-50 text-violet-500",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[color]}`}>
      {value}
    </span>
  );
}

export default function HistoryTable() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/attendance/history")
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-10">
      <div className="w-5 h-5 rounded-full border-2 border-stone-200 border-t-stone-600 animate-spin" />
    </div>
  );

  if (history.length === 0) return (
    <div className="px-6 py-10 text-sm text-stone-400">
      No history yet. Complete your first shift to see records here.
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <div className="px-6 py-4 border-b border-stone-100">
        <p className="text-sm font-semibold text-stone-700">Attendance History</p>
        <p className="text-xs text-stone-400">Last 30 days</p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-100 bg-stone-50">
            {["Date", "In", "Out", "Regular", "OT", "Night Diff", "Late", "Undertime", "Total"].map((h) => (
              <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-stone-400 px-5 py-3 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {history.map((row) => (
            <tr key={row.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/60 transition-colors">
              <td className="px-5 py-3 font-semibold text-stone-700 whitespace-nowrap">{row.date}</td>
              <td className="px-5 py-3"><TimeCell ts={row.punchIn} /></td>
              <td className="px-5 py-3"><TimeCell ts={row.punchOut} /></td>
              <td className="px-5 py-3 text-stone-600">{minsToHrsMins(Math.round(row.regularHours * 60))}</td>
              <td className="px-5 py-3">
                <Pill value={row.overtimeHours > 0 ? minsToHrsMins(Math.round(row.overtimeHours * 60)) : null} color="blue" />
              </td>
              <td className="px-5 py-3">
                <Pill value={row.nightDiffHours > 0 ? minsToHrsMins(Math.round(row.nightDiffHours * 60)) : null} color="violet" />
              </td>
              <td className="px-5 py-3">
                <Pill value={row.lateMinutes > 0 ? minsToHrsMins(Math.floor(row.lateMinutes)) : null} color="orange" />
              </td>
              <td className="px-5 py-3">
                <Pill value={row.undertimeMinutes > 0 ? minsToHrsMins(Math.floor(row.undertimeMinutes)) : null} color="red" />
              </td>
              <td className="px-5 py-3 font-semibold text-stone-700">{Math.floor(row.totalWorkHours)}h</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}