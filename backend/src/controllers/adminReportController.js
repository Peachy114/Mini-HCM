import {db} from "../config/firebase-admin.js";
import { computeMetrics } from "../utils/computeMatrics.js";
import { round2, dateToString, getMondayString, todayString} from "../utils/helper.js"

//api/admin/reports/daily?date=something
// export const getDailyReport = async (req, res) => {
//   try {
//     const date = req.query.date || todayString();
//     console.log('=== DAILY REPORT ===', date);

//     // Get all summaries for that date
//     const snap = await db.collection('dailySummary')
//       .where('date', '==', date)
//       .get();

//     if (snap.empty) {
//       return res.json([]);
//     }

//     // Get all users to attach names
//     const usersSnap = await db.collection('users').get();
//     const usersMap  = {};
//     usersSnap.docs.forEach(d => { usersMap[d.id] = d.data(); });

//     const report = snap.docs.map(doc => {
//       const s    = doc.data();
//       const user = usersMap[s.userId] || {};
//       return {
//         id:           doc.id,
//         userId:       s.userId,
//         name:         user.name  || 'Unknown',
//         email:        user.email || '',
//         role:         user.role  || '',
//         date:         s.date,
//         scheduledStart:    s.scheduledStart,
//         scheduledEnd:      s.scheduledEnd,
//         regularHours:      s.regularHours      || 0,
//         overtimeHours:     s.overtimeHours     || 0,
//         nightDiffHours:    s.nightDiffHours    || 0,
//         lateMinutes:       s.lateMinutes       || 0,
//         undertimeMinutes:  s.undertimeMinutes  || 0,
//         totalWorkHours:    s.totalWorkHours    || 0,
//         punchIn:           s.punchIn,
//         punchOut:          s.punchOut,
//       };
//     });

//     return res.json(report);

//   } catch (err) {
//     console.log('=== DAILY REPORT ERROR ===', err.message);
//     return res.status(500).json({ error: err.message });
//   }
// };
export const getDailyReport = async (req, res) => {
  try {
    const date = req.query.date || todayString();

    const snap = await db.collection('dailySummary')
      .where('date', '==', date)
      .get();

    const usersSnap = await db.collection('users').get();
    const usersMap  = {};
    usersSnap.docs.forEach(d => { usersMap[d.id] = d.data(); });

    const report = snap.docs.map(doc => {
      const s    = doc.data();
      const user = usersMap[s.userId] || {};
      return {
        id:               doc.id,
        userId:           s.userId,
        name:             user.name  || 'Unknown',
        email:            user.email || '',
        date:             s.date,
        scheduledStart:   s.scheduledStart,
        scheduledEnd:     s.scheduledEnd,
        regularHours:     s.regularHours     || 0,
        overtimeHours:    s.overtimeHours    || 0,
        nightDiffHours:   s.nightDiffHours   || 0,
        lateMinutes:      s.lateMinutes      || 0,
        undertimeMinutes: s.undertimeMinutes || 0,
        totalWorkHours:   s.totalWorkHours   || 0,
        punchIn:          s.punchIn,
        punchOut:         s.punchOut,
      };
    });

    return res.json(report);

  } catch (err) {
    console.log('=== DAILY REPORT ERROR ===', err.message);
    return res.status(500).json({ error: err.message });
  }
};

//api/admin/reports/weekly?weekStart=something
export const getWeeklyReport = async (req, res) => {
  try {
    console.log('=== WEEKLY REPORT ===');

    // Build 7 dates for the week
    const weekStart = req.query.weekStart || getMondayString();
    const dates     = [];
    const start     = new Date(weekStart);

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      dates.push(dateToString(d));
    }

    // Firestore 'in' query max 10 items — 7 days is fine
    const snap = await db.collection('dailySummary')
      .where('date', 'in', dates)
      .get();

    // Get all users
    const usersSnap = await db.collection('users').get();
    const usersMap  = {};
    usersSnap.docs.forEach(d => { usersMap[d.id] = d.data(); });

    // Group by userId and aggregate
    const grouped = {};
    snap.docs.forEach(doc => {
      const s = doc.data();
      if (!grouped[s.userId]) {
        const user = usersMap[s.userId] || {};
        grouped[s.userId] = {
          userId:               s.userId,
          name:                 user.name  || 'Unknown',
          email:                user.email || '',
          weekStart,
          weekEnd:              dates[6],
          totalRegularHours:    0,
          totalOvertimeHours:   0,
          totalNightDiffHours:  0,
          totalLateMinutes:     0,
          totalUndertimeMinutes:0,
          totalWorkHours:       0,
          daysPresent:          0,
          dailyBreakdown:       [],
        };
      }

      const g = grouped[s.userId];
      g.totalRegularHours     = round2(g.totalRegularHours    + (s.regularHours     || 0));
      g.totalOvertimeHours    = round2(g.totalOvertimeHours   + (s.overtimeHours    || 0));
      g.totalNightDiffHours   = round2(g.totalNightDiffHours  + (s.nightDiffHours   || 0));
      g.totalLateMinutes             += (s.lateMinutes      || 0);
      g.totalUndertimeMinutes        += (s.undertimeMinutes || 0);
      g.totalWorkHours        = round2(g.totalWorkHours       + (s.totalWorkHours   || 0));
      g.daysPresent++;
      g.dailyBreakdown.push({ date: s.date, ...s });
    });

    return res.json(Object.values(grouped));

  } catch (err) {
    console.log('weekly error', err.message);
    return res.status(500).json({ error: err.message });
  }
};

//api/admin/reports/attendance?date=2026-02-22
export const getAttendanceByDate = async (req, res) => {
  try {
    const date = req.query.date || todayString();
    console.log('=== GET ATTENDANCE BY DATE ===', date);

    const snap = await db.collection('attendance')
      .where('date', '==', date)
      .get();

    const usersSnap = await db.collection('users').get();
    const usersMap  = {};
    usersSnap.docs.forEach(d => { usersMap[d.id] = d.data(); });

    const records = snap.docs.map(doc => {
      const r = doc.data();
      const user = usersMap[r.userId] || {};
      return {
        id:     doc.id,
        name:   user.name  || 'Unknown',
        email:  user.email || '',
        ...r,
      };
    });
    return res.json(records);

  } catch (err) {
    console.log('=== GET ATTENDANCE ERROR ===', err.message);
    return res.status(500).json({ error: err.message });
  }
};

// PATCH /api/admin/reports/attendance/:id
// Edit a punch record and recompute summary
export const editAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { punchIn, punchOut } = req.body;
    console.log('=== EDIT ATTENDANCE ===', id);

    const docRef = db.collection('attendance').doc(id);
    const snap   = await docRef.get();

    if (!snap.exists) {
      return res.status(404).json({ error: 'Attendance record not found.' });
    }

    const record = snap.data();
    const newIn  = new Date(punchIn);
    const newOut = new Date(punchOut);

    // Update attendance record
    await docRef.update({
      punchIn:  newIn,
      punchOut: newOut,
      status:   'closed',
    });

    // Recompute metrics
    const userSnap = await db.collection('users').doc(record.userId).get();
    const user = userSnap.data();
    const schedule = user.schedule || { start: '09:00', end: '18:00' };
    const metrics = computeMetrics(newIn, newOut, schedule);

    // Update daily summary
    const summaryId = `${record.userId}_${record.date}`;
    await db.collection('dailySummary').doc(summaryId).set({
      punchIn:  newIn,
      punchOut: newOut,
      ...metrics,
      computedAt: new Date(),
    }, { merge: true });

    console.log('=== EDIT SUCCESS ===', metrics);
    return res.status(200).json({ message: 'Attendance updated.', metrics });

  } catch (err) {
    console.log('=== EDIT ATTENDANCE ERROR ===', err.message);
    return res.status(500).json({ error: err.message });
  }
};