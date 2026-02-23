import { auth, db } from '../config/firebase-admin.js';

export const verifyToken = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided.'});
        }

        const token = header.split(' ')[1]; 
        // const token = header.split('Bearer ')[1];
        const decoded = await auth.verifyIdToken(token);

        //to get role
        const snap = await db.collection('users').doc(decoded.uid).get();
        if (snap.exists)  {
            req.user = { ...decoded, ...snap.data() };
        } else {
            req.user = decoded;
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token'});
    }
}

