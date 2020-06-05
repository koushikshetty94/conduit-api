var express = require('express');
var router = express.Router();
var url = require('url');
var Article = require('../../models/articles');

// get all tags

router.get("/", async (req, res) => {
    try {
      var tags = await Article.find().distinct("tagList");
      res.json({ tags });
    } catch (error) {
      res.status(400).json(error);
    }
  });

module.exports = router;