const db = require('../config/db');

const roleController = {

    async creat_role(req,res){
        try{
            const {role_name} = req.body;
            if(!role_name){
                return res.status(400).json({
                    status : false,
                    message:"All fields are required"
                });
            }
            const [exist_role] = await db.promise().query('SELECT * FROM roles WHERE name = ?', [role_name]);
            if(exist_role.length > 0){
                return res.status(400).json({
                    status : false,
                    message:"Role already exists"
                });
            }
            const [result] = await db.promise().query('INSERT INTO roles (name) VALUES (?)', [role_name]);
            return res.status(200).json({
                status : true,
                message:"Role created successfully",
                insert_role:result.insertId,
            });
        }
        catch(err){
            console.log(err);
             return res.status(200).json({
                status : false,
                message: "Server error",
                error: err.message,
            });
        }
    },
    async fetch_roles(req,res){
        try{
           const [result] = await db.promise().query(`
  SELECT 
    u.id AS user_id,
    u.name AS user_name,
    u.email,
    r.name AS role_name,
    GROUP_CONCAT(p.name ORDER BY p.id SEPARATOR ', ') AS permissions
  FROM user_roles ur
  JOIN users u ON ur.user_id = u.id
  JOIN roles r ON ur.role_id = r.id
  JOIN role_permissions rp ON rp.role_id = r.id
  JOIN permissions p ON p.id = rp.permission_id
  GROUP BY u.id, u.name, u.email, r.id, r.name
`);

            return res.status(200).json({
                status : true,
                message:"Roles fetched successfully",
                roles:result,
            });
        }
        catch(err){
            console.log(err);
             return res.status(200).json({
                status : false,
                message: "Server error",
                error: err.message,
            });
        }
    },
    async fetch_roles_by_roles(req,res){
        try{
           const [result] = await db.promise().query(`
  SELECT 
    r.name AS role_name, r.id AS role_id,
    GROUP_CONCAT(p.name ORDER BY p.id SEPARATOR ', ') AS permissions, group_concat(p.id) as permission_ids      
  FROM roles r
  JOIN role_permissions rp ON rp.role_id = r.id
  JOIN permissions p ON p.id = rp.permission_id
  GROUP BY r.id
`);

            return res.status(200).json({
                status : true,
                message:"Roles Permission fetched successfully",
                roles:result,
            });
        }
        catch(err){
            console.log(err);
             return res.status(200).json({
                status : false,
                message: "Server error",
                error: err.message,
            });
        }
    }


};


module.exports = roleController;