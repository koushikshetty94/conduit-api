var express = require('express');
var router = express.Router();
var auth = require('../../modules/auth');
var articlesController = require('../../controllers/articlesController');

// create article
router.post("/", auth.verifyToken, articlesController.createArticle);

// list all articles
router.get("/", articlesController.listArticles);

// feed articles

router.get('/feed', auth.verifyToken, articlesController.feedArticles);

// update artcile route
router.put('/:slug', auth.verifyToken, articlesController.updateArticle);

// delete single article 

router.delete('/:slug', auth.verifyToken, articlesController.deleteArticle);

// add comments to an article

router.post('/:slug/comments', auth.verifyToken, articlesController.addComment);

// delete comments from an article

router.delete('/:slug/comments/:id', auth.verifyToken, articlesController.deleteArticle);

//  favorite an article

router.post('/:slug/favorite', auth.verifyToken, articlesController.favoriteArticle);

// unfavorite an article

router.delete('/:slug/favorite', auth.verifyToken, articlesController.unfavoriteArticle);

module.exports = router; 