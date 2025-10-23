const { response } = require('express');
const db = require('../config/db');

const rolehaspermissionController = {

    async rolegivepermission(req, res) {
        try {
            const { role_id, permission_id } = req.body;
            if (!role_id && !permission_id) {
                return res.status(400).json({
                    status: false,
                    message: "role & Permission Id needed",
                })
            }
            let inserted_id = [];
            const [delete_role_has_permissions] = await db.promise().query(
                "DELETE FROM role_permissions WHERE role_id = ?",
                [role_id]
            )
            for (let i = 0; i < permission_id.length; i++) {
                const permName = permission_id[i];
                const [result] = await db.promise().query(
                    "INSERT INTO role_permissions (role_id,permission_id) VALUES (?,?)",
                    [role_id, permName]
                );
                inserted_id.push({
                    id: result.insertId,
                    role_id,
                    permission_id: permName
                });
            }

            return res.status(200).json({
                status: true,
                message: "Role permissions assigned successfully",
                inserted_id: inserted_id,
            });
        } catch (error) {
            return res.status(400).json({
                status: false,
                message: "role given permission failed",
                error: error
            });
        }
    },

    async role_permission_user(req,res){
        try{
            const {role_id,user_id} = req.body;
            if(!role_id && user_id){
                return res.status(400).json({
                    status : false,
                    message:"All fields are required"
                });
            }
            const[exist] = await db.promise().query('SELECT * FROM user_roles WHERE user_id = ?', [user_id]);
            if(exist.length > 0){
                  const [update_result] = await db.promise().query('UPDATE user_roles SET role_id = ? WHERE user_id = ?', [role_id,user_id]);
                return res.status(200).json({
                    status : true,
                    message:"User update assigned to role"
                });
            }
            const [result] = await db.promise().query('INSERT INTO user_roles (role_id,user_id) VALUES (?,?)', [role_id,user_id]);
    
            return res.status(200).json({
                status : true,
                message:"User Assigned to role successfully",
            });

        }catch(err){
            console.log(err);
            return res.status(200).json({
                status : false,
                message: "Server error",
                error: err.message,
            });
        }
    },

    async fetch_user_permission(req,res){
        try{
            const {user_id} = req.params;
            if(!user_id){
                return res.status(400).json({
                    status : false,
                    message:"All fields are required"
                });
            }
            const [result] = await db.promise().query('SELECT * FROM user_roles WHERE user_id = ?', [user_id]);
            if(result.length > 0){
                const [role_result] = await db.promise().query('SELECT name FROM roles WHERE id = ?', [result[0].role_id]);
                const [permission_result] = await db.promise().query('SELECT * FROM role_permissions JOIN permissions ON role_permissions.permission_id = permissions.id WHERE role_id = ?', [result[0].role_id]);
                return res.status(200).json({
                    status : true,
                    message:"User permissions fetched successfully",
                    role:role_result[0],
                    permissions:permission_result
                });
            }else{
                return res.status(400).json({
                    status : false,
                    message:"User not found"
                });
            }
        }catch(err){
            console.log(err);
            return res.status(200).json({
                status : false,
                message: "Server error",
                error: err.message,
            });
        }
    }
};

module.exports = rolehaspermissionController;