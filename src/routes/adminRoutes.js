const express = require('express');
const routes = express.Router();
//auth middleware check the token is avilabel or not with time expires
const authMiddleware = require('../middlewares/authmiddleware');
//permission middleware check the user has permission or not
const permissionMiddleware = require('../middlewares/checkpermissionmiddleware');
const roleController = require('../controllers/rolecontroller');
const permissionController = require('../controllers/permissioncontroller');
const rolehaspermissionController = require('../controllers/rolehaspermissioncontroller');
const categoryController = require('../controllers/categorycontroller');

//role_controller
routes.post('/create_role',authMiddleware,permissionMiddleware('create_role'),roleController.creat_role);
routes.get('/fetch_roles',authMiddleware,permissionMiddleware('list_role'),roleController.fetch_roles);
routes.get('/fetch_roles_by_roles',authMiddleware,roleController.fetch_roles_by_roles);

//category_controller
// routes.post('/create_category',authMiddleware,categoryController.create_category);
routes.post('/create_category', categoryController.create_category);
// routes.get('/fetch_category',authMiddleware,categoryController.fetch_category);
routes.get('/fetch_category',categoryController.fetch_category);
routes.get('/edit_category/:id',authMiddleware,categoryController.edit_category);
routes.post('/update_category/:id',authMiddleware,categoryController.update_category);
routes.post('/delete_category/:id',authMiddleware,categoryController.delete_category);



//permission_controller
routes.get('/create_permission',authMiddleware,permissionMiddleware('create_permission'),permissionController.store_permission);
routes.get('/get_all_permission',authMiddleware,permissionController.get_all_permission);
routes.get('/get_all_permission_by_role_id/:role_id',authMiddleware,permissionController.get_all_permission_by_role_id);
routes.post('/store_role_has_permission',authMiddleware,rolehaspermissionController.rolegivepermission);
routes.post('/user_assign_role',authMiddleware,permissionMiddleware('edit_user'),rolehaspermissionController.role_permission_user);
routes.get('/fetch_user_permission/:user_id',authMiddleware,rolehaspermissionController.fetch_user_permission);

module.exports = routes;