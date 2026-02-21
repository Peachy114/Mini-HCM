import { db } from '../config/firebase-admin.js';

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    console.log('=== REGISTER HIT ===');
    console.log('req.user:', req.user);
    console.log('req.body:', req.body);

    const { name, timezone, scheduleStart, scheduleEnd } = req.body;

    const uid   = req.user.uid;
    const email = req.user.email;

    if (!name) {
      return res.status(400).json({ error: 'name is required.' });
    }

    const existing = await db.collection('users').doc(uid).get();
    if (existing.exists) {
      return res.status(409).json({ error: 'User profile already exists' });
    }

    const userSnap = await db.collection('users').limit(1).get();
    const role     = userSnap.empty ? 'admin' : 'employee';

    const userProfile = {
      uid,
      name,
      email,
      role,
      timezone: timezone    || 'Asia/Manila',
      schedule: {
        start: scheduleStart || '09:00',
        end:   scheduleEnd   || '18:00',
      },
      createdAt: new Date(),
    };

    await db.collection('users').doc(uid).set(userProfile);
    console.log('=== PROFILE SAVED ===', userProfile);

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
    console.log('=== LOGIN HIT ===');
    console.log('req.user:', req.user);

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

    console.log('=== LOGIN SUCCESS ===', profile);

    return res.status(200).json({
      message: 'Login successful',
      user: profile,
    });

  } catch (err) {
    console.log('=== LOGIN ERROR ===', err.message);
    return res.status(500).json({ error: err.message });
  }
};

// GET /api/auth/me
export const getProfile = async (req, res) => {
  try {
    console.log('=== GET ME HIT ===');
    console.log('req.user:', req.user);

    const uid  = req.user.uid;
    const snap = await db.collection('users').doc(uid).get();

    if (!snap.exists) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    return res.json(snap.data());

  } catch (err) {
    console.log('=== GET ME ERROR ===', err.message);
    return res.status(500).json({ error: err.message });
  }
};
