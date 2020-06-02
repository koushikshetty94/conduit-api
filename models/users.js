const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    image: {
        type: String
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

})

userSchema.pre("save", function (next) {
    if (this.password && this.isModified("password")) {
        bcrypt.hash(this.password, 10, (err, password) => {
            if (err) return next(err);
            this.password = password;
            next();
        });
    } else {
        next();
    }
});

userSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema)