const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const userController = require('../apis/user');

router.post("/signup", userController.createUser);

router.post("/login", userController.userLogin);

router.get("/list", checkAuth, userController.listUsers);

router.get("/search", checkAuth, userController.searchUsers);

router.put('/update/:id',checkAuth, userController.updateUser);

module.exports = router;