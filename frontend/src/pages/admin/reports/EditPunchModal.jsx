// import { useState } from "react";

// export default function EditPunchModal({ record, onSave, onClose }) {
//   const toInputValue = (ts) => {
//     if (!ts) return '';
//     const d   = ts._seconds ? new Date(ts._seconds * 1000) : new Date(ts);
//     const pad = (n) => String(n).padStart(2, '0');
//     return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
//   };

//   const [punchIn,  setPunchIn]  = useState(toInputValue(record.punchIn));
//   const [punchOut, setPunchOut] = useState(toInputValue(record.punchOut));
//   const [saving,   setSaving]   = useState(false);

//   async function handleSave() {
//     if (!punchIn || !punchOut) return;
//     setSaving(true);
//     await onSave(record.id, punchIn, punchOut);
//     setSaving(false);
//   }

//   return (
//     <div style={{
//       position: 'fixed', inset: 0,
//       background: 'rgba(0,0,0,0.5)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center'
//     }}>
//       <div style={{ background: 'white', padding: 24, borderRadius: 8, minWidth: 320 }}>
//         <h3>Edit Punch — {record.name}</h3>
//         <div>
//           <label>Login Time</label><br />
//           <input
//             type="datetime-local"
//             value={punchIn}
//             onChange={e => setPunchIn(e.target.value)}
//           />
//         </div>
//         <br />
//         <div>
//           <label>Logout Time</label><br />
//           <input
//             type="datetime-local"
//             value={punchOut}
//             onChange={e => setPunchOut(e.target.value)}
//           />
//         </div>
//         <br />
//         <button onClick={handleSave} disabled={saving || !punchIn || !punchOut}>
//           {saving ? 'Saving...' : 'Save & Recompute'}
//         </button>
//         <button onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
//       </div>
//     </div>
//   );
// } =================================debugging======================
import { useState } from "react";

export default function EditPunchModal({ record, onSave, onClose }) {
  const toInputValue = (ts) => {
    if (!ts) return '';
    const d = ts._seconds ? new Date(ts._seconds * 1000) : new Date(ts);
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [punchIn,  setPunchIn]  = useState(toInputValue(record.punchIn));
  const [punchOut, setPunchOut] = useState(toInputValue(record.punchOut));
  const [saving,   setSaving]   = useState(false);

  async function handleSave() {
    if (!punchIn || !punchOut) return;
    setSaving(true);
    await onSave(record.id, punchIn, punchOut);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-xl w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-0.5">Edit Punch</p>
            <h3 className="text-sm font-bold text-stone-800">{record.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="border-t border-stone-100" />

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-500">Clock In Time</label>
            <input
              type="datetime-local"
              value={punchIn}
              onChange={e => setPunchIn(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400 bg-stone-50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-500">Clock Out Time</label>
            <input
              type="datetime-local"
              value={punchOut}
              onChange={e => setPunchOut(e.target.value)}
              className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400 bg-stone-50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !punchIn || !punchOut}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save & Recompute'}
          </button>
        </div>
      </div>
    </div>
  );
}