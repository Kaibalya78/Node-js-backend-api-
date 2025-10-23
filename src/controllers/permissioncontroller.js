const db = require('../config/db');

const permissionController = {
    async store_permission(req,res){
        try{
            const {permission} = req.body;
                      if (!permission || !Array.isArray(permission) || permission.length === 0) {
                return res.status(400).json({
                    status: false,
                    message: "Permission array is required"
                });
            }

            let inserted = [];
            let skipped = [];

            for (let i = 0; i < permission.length; i++) {
                const permName = permission[i];

              const [exists] = await db.promise().query(
                    "SELECT id FROM permissions WHERE name = ?",
                    [permName]
                );

                if (exists.length > 0) {
                    skipped.push(permName); 
                    continue;
                }
                const [result] = await db.promise().query(
                    "INSERT INTO permissions (name) VALUES (?)",
                    [permName]
                );
                inserted.push({ id: result.insertId, name: permName });
            }

             return res.status(200).json({
                status: true,
                message: "Permission process completed",
                inserted,
                skipped
            });
        }catch(err){
            return res.status(200).json({
                status : false,
                message: "Server error",
                error: err.message,
            })
        }
    },

    async get_all_permission(req,res){
      const data = await db.query('SELECT * FROM permissions');
      if(data.length > 0){
        return res.status(200).json(data);
      }
    },

     async get_all_permission_by_role_id(req,res){
    const role_name = await db.query('SELECT name FROM  roles where id = ?', [req.params.role_id]);
    const data = await db.query('SELECT * FROM role_permissions JOIN permissions ON role_permissions.permission_id = permissions.id  WHERE role_permissions.role_id = ?', [req.params.role_id]);
      if(data.length > 0){
        return res.status(200).json({
            status : true,
            message:"Permissions fetched successfully",
            role_name :role_name,
            permissions: data});
      }else{
        return res.status(200).json([]);
      }
    }
};

module.exports = permissionController;