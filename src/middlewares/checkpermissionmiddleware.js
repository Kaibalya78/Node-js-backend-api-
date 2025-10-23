const db = require("../config/db");

const checkPermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id; 
            // get user role
            // return res.json(userId);
            const [user] = await db.promise().query(
                "SELECT role_id FROM user_roles WHERE user_id = ?",
                [userId]
            );
            if (user.length === 0) {
                return res.status(403).json({ status: false, message: "User not found" });
            }
            const roleId = user[0].role_id;
            // check if role has the permission
            const [rows] = await db.promise().query(
                `SELECT p.name 
                 FROM role_permissions rp 
                 JOIN permissions p ON rp.permission_id = p.id 
                 WHERE rp.role_id = ? AND p.name = ?`,
                [roleId, permissionName]
            );

            if (rows.length === 0) {
                return res.status(403).json({
                    status: false,
                    message: "You do not have permission: " + permissionName
                });
            }
            next(); // ✅ user has permission
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: false, message: "Server error" });
        }
    };
};

module.exports = checkPermission;
