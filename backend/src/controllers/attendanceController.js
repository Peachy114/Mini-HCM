import { db } from '../config/firebase-admin.js';
import { computeMetrics } from '../utils/computeMatrics.js';
import { todayString } from '../utils/helper.js';

export const punchIn = async (req, res) => {
  try {
    console.log('=== PUNCH IN ===', req.user.uid);

    const uid   = req.user.uid;
    const today = todayString();

    // Check if already punched in today
     const existing = await db.collection('attendance')
      .where('userId', '==', uid)
      .where('date',   '==', today)
      .limit(1)
      .get();

    if (!existing.empty) {
      const status = existing.docs[0].data().status;
      if (status === 'open') {
        return res.status(409).json({ error: 'Already punched in. Please punch out first.' });
      }
      return res.status(409).json({ error: 'Already completed attendance for today.' });
    }

    const now    = new Date();
    const docRef = await db.collection('attendance').add({
      userId:   uid,
      date:     today,
      punchIn:  now,
      punchOut: null,
      status:   'open',
    });

    return res.status(201).json({
      message:      'Punched in successfully.',
      attendanceId: docRef.id,
      punchIn:      now,
    });

  } catch (err) {
    console.log('=== PUNCH IN ERROR ===', err.message);
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/attendance/punch-out
export const punchOut = async (req, res) => {
  try {
    console.log('=== PUNCH OUT ===', req.user.uid);

    const uid   = req.user.uid;
    const today = todayString();

    // Find open record for today
    const snap = await db.collection('attendance')
      .where('userId', '==', uid)
      .where('date',   '==', today)
      .where('status', '==', 'open')
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(404).json({ error: 'No active punch-in found. Please punch in first.' });
    }

    const attendanceDoc = snap.docs[0];
    const punchInTime   = attendanceDoc.data().punchIn;
    const now           = new Date();

    // Update attendance record
    await attendanceDoc.ref.update({ punchOut: now, status: 'closed' });

    // Compute metrics using user's schedule
    const schedule = req.user.schedule || { start: '09:00', end: '18:00' };
    const metrics  = computeMetrics(punchInTime, now, schedule);

    // Save daily summary — id = userId_date
    const summaryId = `${uid}_${today}`;
    await db.collection('dailySummary').doc(summaryId).set({
      userId:         uid,
      date:           today,
      scheduledStart: schedule.start,
      scheduledEnd:   schedule.end,
      punchIn:        punchInTime,
      punchOut:       now,
      ...metrics,
      computedAt:     now,
    }, { merge: true });

    return res.status(200).json({
      message: 'Punched out successfully.',
      metrics,
    });

  } catch (err) {
    console.log('=== PUNCH OUT ERROR ===', err.message);
    return res.status(500).json({ error: err.message });
  }
};


// GET /api/attendance/today
export const getToday = async (req, res) => {
  try {
    const uid   = req.user.uid;
    const today = todayString();

    const snap = await db.collection('attendance')
      .where('userId', '==', uid)
      .where('date',   '==', today)
      .limit(1)
      .get();

    if (snap.empty) return res.json(null);

    return res.json({ id: snap.docs[0].id, ...snap.docs[0].data() });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/attendance/summary/today
export const getTodaySummary = async (req, res) => {
  try {
    const uid       = req.user.uid;
    const today     = todayString();
    const summaryId = `${uid}_${today}`;

    const snap = await db.collection('dailySummary').doc(summaryId).get();

    if (!snap.exists) return res.json(null);

    return res.json(snap.data());

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/attendance/history
export const getHistory = async (req, res) => {
  try {
    const uid  = req.user.uid;

    const snap = await db.collection('dailySummary')
      .where('userId', '==', uid)
      .orderBy('date', 'desc')
      .limit(30)
      .get();

    const history = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return res.json(history);

  } catch (err) {
    console.log('=== HISTORY ERROR ===', err.message);
    return res.status(500).json({ error: err.message });
  }
};