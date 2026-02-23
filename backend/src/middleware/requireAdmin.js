export const requireAdmin = (req, res, next) => {
    console.log('role value:', req.user.role);
    console.log('role length:', req.user.role?.length);
    console.log('role charCodes:', [...(req.user.role || '')].map(c => c.charCodeAt(0)));
    
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin only.'});
    }
    next();
}