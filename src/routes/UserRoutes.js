const express = require('express');
const routes = express.Router();
const authController = require('../controllers/authcontroller');

routes.get('/check',(req,res)=>{
    res.send('<h1 style="text-align: center;margin-top: 12%;color: red;"> Welcome To the World Of Node.js.</h1>');
});
routes.post('/store_user',authController.create_user);
routes.get('/fetch_user',authController.fetch_user);
routes.get('/fetch_role',authController.fetch_role);
routes.get('/fetch_user_by_id/:id',authController.fetch_user_by_id);
routes.post('/update_user/:id',authController.update_user);
routes.post('/delete_user/:id',authController.delete_user);
routes.post('/login',authController.login_user);

module.exports = routes;   
