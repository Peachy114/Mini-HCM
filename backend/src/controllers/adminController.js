import { db } from "../config/firebase-admin.js";

// api/admin/employees
export const getAllEmployee = async (req, res ) => {
    try {
        const snap = await db.collection('users').orderBy('name').get();
        const employees = snap.docs.map(doc => doc.data());

        return res.status(200).json(employees);
    } catch (err) {
        console.log('Get all employee error');
        return res.status(500).json({ error: err.message });
    }
};

//api/admin/employee/:uid
export const getEmployee = async (req, res) => {
    try {
        const snap = await db.collection('users').doc(req.params.uid).get();

        if(!snap.exists) return res.status(404).jspn({ error: 'Employee not found'});
        return res.status(200).json(snap.data());
    } catch (err) {
        console.log('errror get employee', err.message);
        return res.status(500).json({ error: err.message});
    }
}

//edit employee - name, timezone, schedule, role
export const updateEmployee = async (req, res) => {
    try {
        const { name, timezone, scheduleStart, scheduleEnd, role } = req.body;

        //store here
        const updates = {};
        if (name) updates.name = name;
        if (timezone) updates.timezone = timezone;
        if (role) updates.role = role;
        if (scheduleStart || scheduleEnd) {
            const snap = await db.collection('users').doc(req.params.uid).get();
            const current = snap.data().schedule || {};
            updates.schedule = {
                start: scheduleStart || current.start,
                end: scheduleEnd || current.end,
            };
        }

        await db.collection('users').doc(req.params.uid).update(updates);
        return res.status(200).json({ message: 'Employee updated successfully.', updates});

    } catch (err) {
        console.log('error update employee backend', err.message);
        return res.status(500).json({ error: err.message});
    }
}