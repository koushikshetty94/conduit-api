var express = require('express');
var router = express.Router();
var auth = require('../../modules/auth');
var usersController = require('../../controllers/usersController');

// signup
router.post('/', usersController.signUp)
// login

router.post("/login", usersController.login)

// only logged user can access the following routes
// get current logged user

router.get("/", auth.verifyToken, usersController.getCurrentUser);

// update user route

router.put("/", auth.verifyToken, usersController.updateUser);

// get profile route

router.get("/profile/:username", auth.verifyToken, usersController.getProfile);

// follow route

router.post("/profiles/:username/follow", auth.verifyToken, usersController.follow);

// unfollow route

router.delete("/profiles/:username/unfollow", auth.verifyToken, usersController.unfollw);


module.exports = router;
