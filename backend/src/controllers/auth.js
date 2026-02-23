import { db } from '../config/firebase-admin.js';

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, timezone } = req.body;
    const uid   = req.user.uid;
    const email = req.user.email;

    if (!name) return res.status(400).json({ error: 'name is required.' });

    const existing = await db.collection('users').doc(uid).get();
    if (existing.exists) return res.status(409).json({ error: 'User profile already exists' });

    const usersSnap = await db.collection('users').limit(1).get();
    const role= usersSnap.empty ? 'admin' : 'employee';

    const userProfile = {
      uid,
      name,
      email,
      role,
      timezone: timezone || 'Asia/Manila',
      schedule: {
        start: '09:00',
        end:   '18:00',
      },
      createdAt: new Date(),
    };

    await db.collection('users').doc(uid).set(userProfile);
    console.log('=== PROFILE SAVED ===', uid);

    return res.status(201).json({
      message: 'User registered successfully.',
      role,
      uid,
    });

  } catch (err) {
    console.log('=== REGISTER ERROR ===', err.message);
    return res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const uid = req.user.uid;

    const snap = await db.collection('users').doc(uid).get();

    // Bug fix 1: was snap.exist → should be snap.exists
    if (!snap.exists) {
      return res.status(404).json({
        error: 'No profile found. Please register first.'
      });
    }

    // Bug fix 2: get profile from snap.data(), not undefined variable
    const profile = snap.data();

    if (profile.isActive === false) {
      return res.status(403).json({
        error: 'Account is deactivated. Contact admin.'
      });
    }
    return res.status(200).json({
      message: 'Login successful',
      user: profile,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/auth/me
export const getProfile = async (req, res) => {
  try {
    const uid  = req.user.uid;
    const snap = await db.collection('users').doc(uid).get();

    if (!snap.exists) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    return res.json(snap.data());

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
