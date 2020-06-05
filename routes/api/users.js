var express = require('express');
var router = express.Router();
var User = require('../../models/users');
var auth = require('../../modules/auth');

router.post("/", (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.json({ success: true, message: "Registration Succesful!" });
  });
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  try {
    var user = await User.findOne({ email })
    if (!user) {
      return res.json({ sucess: false, message: "wrong email" });
    }
    if (!user.verifyPassword(password)) {
      return res.json({ success: false, message: "wrong password" });
    }
    var token = await auth.generateJWT(user)
    return res.json({ success: true, message: "login succesfull", token });
  }
  catch (err) {
    console.log(err);
    res.json({ success: false, err })
  }
})

// only logged user can access the following routes

// get current logged user

router.get("/", auth.verifyToken, async (req, res) => {
  try {
    console.log(req.user.userID);
    var user = await User.findById(req.user.userID);
    if (user == null) {
      return res.status(400).error("no user found");
    }
    res.json({ user });
  } catch (err) {
    res.json({ err });
  }
});

// update user route

router.put("/", auth.verifyToken, async (req, res) => {
  try {
    var user = await User.findByIdAndUpdate(req.user.userID, req.body, { new: true });
    console.log(user);
    if (user == null) {
      return res.status(400).error("no user found");
    }
    res.json({ user });
  } catch (err) {
    res.json({ err });
  }
});

// get profile route

router.get("/profile/:username", auth.verifyToken, async (req, res) => {
  try {
    console.log(req.params.username);
    var username = req.params.username
    var user = await User.findOne({ username });
    console.log(user);
    if (user == null) {
      return res.json({ success: false, message: "user does not exist" })
    }
    res.json({ success: true, user });
  }
  catch (err) {
    res.json({ err });
  }
})

// follow route

router.post("/profiles/:username/follow", auth.verifyToken, async (req, res) => {
  try {
    var username = req.params.username;
    var currentUserId = req.user.userID;
    var user = await User.findOneAndUpdate({ username }, { $addToSet: { followers: currentUserId } }, { new: true })
    if (user == null) {
      return res.json({ success: false, message: "user does not exist" })
    }
    console.log(user);
    var currentUser = await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: user._id } }, { new: true })
    console.log(currentUser);
    res.json({ success: true, message: "updated successfully", currentUser })
  }
  catch (err) {
    res.json({ success: false, err })
  }
})

// unfollow route

router.delete("/profiles/:username/unfollow", auth.verifyToken, async (req, res) => {
  try {
    var username = req.params.username;
    var currentUserId = req.user.userID;
    var user = await User.findOneAndUpdate({ username }, { $pull: { followers: currentUserId } }, { new: true })
    if (user == null) {
      return res.json({ success: false, message: "user does not exist" })
    }
    console.log(user);
    var currentUser = await User.findByIdAndUpdate(currentUserId, { $pull: { following: user._id } }, { new: true })
    console.log(currentUser);
    res.json({ success: true, message: "updated successfully", currentUser })
  }
  catch (err) {
    res.json({ c, err })
  }
})


module.exports = router;
