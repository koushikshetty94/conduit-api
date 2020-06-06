var User = require('../models/users');
var Article = require('../models/articles');
var Comment = require('../models/comments');
var url = require('url');
var slugg = require('slug');

module.exports = {
    createArticle: async (req, res) => {
        try {
            req.body.author = req.user.userID;
            var newArticle = await Article.create(req.body);
            var article = await Article.findById(newArticle.id).populate("author", [
                "bio",
                "username",
                "image"
            ]);
            res.json({ article });
        } catch (error) {
            res.status(400).json(error);
        }
    },
    listArticles: async (req, res) => {
        try {
            var searchResult = await Article.find(url.parse(req.url, true).query)
                .populate("author", ["username"]).populate("comments", ["body"]).populate("favorited", ["username"])
                .sort({ createdAt: -1 });
            console.log(searchResult);
            if (!searchResult) {
                return res.json({ message: "empty" })
            }
            return res.json({ searchResult });
        } catch (err) {
            res.status(400).json(err);
        }
    },
    feedArticles: async (req, res) => {
        try {
            var currentUser = await User.findById(req.user.userID);
            var articles = await Article.find({ "author": { $in: currentUser.following } }).sort({ createdAt: -1 }).limit(20);
            if (articles == null) {
                return res.json({ sucess: false, message: "no articles to display" })
            }
            return res.json({ success: true, articles });
        }
        catch (err) {
            res.status(400).json({ success: false, err })
        }
    },
    updateArticle: async (req, res) => {
        try {
            if (req.body.title) {
                req.body.slug =
                    (await slugg(req.body.title)) +
                    "-" +
                    ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
            }
            var slug = req.params.slug;
            console.log(req.user.userID, "userid");
            var article = await Article.findOne({ slug })
            console.log(article.author, "autohrid")
            if (req.user.userID == article.author) {
                var updatedArticle = await Article.findOneAndUpdate({ slug }, req.body, {
                    new: true
                })
                return res.json({ success: true, updatedArticle });
            }
            return res.json({ success: false, message: "you are not the author" });
        } catch (err) {
            console.log(err);
            res.status(400).json({ success: false, err })
        }
    },
    deleteArticle: async (req, res) => {
        try {
            var slug = req.params.slug;
            var article = await Article.findOne({ slug });
            if (req.user.userID == article.author) {
                var updatedArticle = await Article.findOneAndRemove({ slug })
                return res.json({ success: true, updatedArticle });
            }
            return res.json({ success: false, message: "you are not the author" });
        } catch (err) {
            console.log(err);
            res.status(400).json({ success: false, err })
        }
    },
    addComment: async (req, res) => {
        try {
            var slug = req.params.slug;
            var article = await Article.findOne({ slug });
            if (article == null) {
                return res.json({ success: false, message: "article does not exist" })
            }
            req.body.article = article.id;
            req.body.author = req.user.userID;
            var comment = await (await Comment.create(req.body)).populate("article").populate("User");
            console.log(comment)
            var updatedArticle = await (await Article.findOneAndUpdate({ slug }, { $push: { comments: comment._id } }, { new: true }));
            return res.json({ success: true, comment, updatedArticle });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ success: false, err })
        }
    },
    deleteComment: async (req, res) => {
        try {
            var slug = req.params.slug;
            var commentId = req.params.id;
            var article = await Article.findOne({ slug });
            if (article == null) {
                return res.json({ success: false, message: "article does not exist" })
            }
            req.body.author = req.user.userID;
            var comment = await (await Comment.deleteOne({ commentId }));
            console.log(comment)
            var updatedArticle = await (await Article.findOneAndUpdate({ slug }, { $pull: { comments: commentId } }, { new: true }));
            return res.json({ success: true, comment, updatedArticle });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ success: false, err })
        }
    },
    favoriteArticle: async (req, res) => {
        try {
            var slug = req.params.slug;
            var userId = req.user.userID
            var article = await Article.findOneAndUpdate({ slug }, { $addToSet: { favorited: userId } }, { new: true }).populate("favorited", ["username"]);
            if (article == null) {
                return res.json({ success: false, message: "no article found" });
            }
            console.log(article.favorited.length);
            return res.json({ success: true, article })
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ success: false, err });
        }
    },
    unfavoriteArticle: async (req, res) => {
        try {
            var slug = req.params.slug;
            var userId = req.user.userID
            var article = await Article.findOneAndUpdate({ slug }, { $pull: { favorited: userId } }, { new: true }).populate("favorited", ["username"]);
            if (article == null) {
                return res.json({ success: false, message: "no article found" });
            }
            console.log(article.favorited.length);
            return res.json({ success: true, article })
        }
        catch (err) {
            console.log(err);
            res.status(400).json({ success: false, err });
        }
    }

}