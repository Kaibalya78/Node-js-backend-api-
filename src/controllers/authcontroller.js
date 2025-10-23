const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    async create_user(req,res){
        try{
            const {name,email,password } = req.body;
            if(!name || !email || !password){
                return res.status(400).json({
                    status : false,
                    message:"All fields are required"
                });
            }
            if(password.length < 8){
                return res.status(400).json({
                    status : false,
                    message:"Password must be at least 8 characters"
                });
            }
            const bcrypt_password = await bcrypt.hash(password,10);
            const [result]  = await db.promise().query('INSERT INTO users (name,email,password) VALUES (?,?,?)', [name,email,bcrypt_password]);
                return res.status(200).json({
                status : true,
                message:"User created successfully",
                insert_user:result.insertId,
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
    async fetch_user(req,res){
        try{
            const [result] = await db.promise().query('SELECT u.*,r.name as role_name FROM users u join user_roles ur on u.id = ur.user_id join roles r on ur.role_id = r.id');
            return res.status(200).json({
                status : true,
                message:"Users fetched successfully",
                users:result,
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
    async fetch_user_by_id(req,res){
        try{
            const id = req.params.id;
            const [result] = await db.promise().query('SELECT u.*,ur.role_id FROM users u left join user_roles ur on  u.id = ur.user_id WHERE u.id = ?', [id]);
            if(result.length == 0){
                return res.status(400).json({   
                    status : false,
                    message:"User not found"
                });
            }
            return res.status(200).json({
                status : true,
                message:"User fetched successfully",
                user:result[0],
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
    async update_user(req,res){
        try{
            const id = req.params.id;
            const {name,email,password,role_id} = req.body;
                        const bcrypt_password = await bcrypt.hash(password,10);

                    const [result] = await db.promise().query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name,email,bcrypt_password,id]);
                    const [role_result] = await db.promise().query('UPDATE user_roles SET role_id = ? WHERE user_id = ?', [role_id,id]);
            return res.status(200).json({
                status : true,
                message:"User Role updated successfully",
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
    async delete_user(req,res){
        try{
            const id = req.params.id;
            // return res.json(req.params.id);
            const [result] = await db.promise().query('DELETE FROM users WHERE id = ?', [id]);
            if(result.affectedRows == 0){
                return res.status(400).json({
                    status : false,
                    message:"User not found"
                });
            }
            return res.status(200).json({
                status : true,
                message:"User deleted successfully",
                user:result,
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
    async login_user(req,res){
            try{    
               const {email,password} = req.body; 
            //    return res.json(req.body);
                if(!email || !password){
                    return res.status(400).json({
                        status : false,
                        message:"All fields are required"
                    });
                }
                const [result] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
                if(result.length == 0){
                    return res.status(400).json({
                        status : false,
                        message:"User not found"
                    });
                }
                const isMatch = await bcrypt.compare(password,result[0].password);
                if(!isMatch){
                    return res.status(400).json({
                        status : false,
                        message:"Invalid password"
                    });
                }else{
                    const token = await jwt.sign({user:{id:result[0].id}},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
                    return res.status(200).json({
                        status : true,
                        message:"User logged in successfully",
                        token:token,
                        user:result[0]
                    });
                }

            }catch(err){
                return res.status(200).json({
                    status : false,
                    message: "Server error",
                    error: err.message,
                });
            }
    },
    async fetch_role(req,res){
        try{
            const [result] = await db.promise().query('SELECT * FROM roles');
            return res.status(200).json({
                status : true,
                message:"Users fetched successfully",
                users:result,
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

};

module.exports = authController;