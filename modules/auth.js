const jwt = require('jsonwebtoken');

module.exports = {
  generateJWT: async (user) => {
    var payload = { userID: user.id, email: user.email, following: user.following};
    var token = await jwt.sign(payload, process.env.SECRET);
    return token;
  }, 
  verifyToken: async (req,res,next) => {
    var token = req.headers['authorization'] || '';
    if(token){
      try{
        var payload = await jwt.verify(token,process.env.SECRET);
        req.user = payload;
        req.user.token = token;
        next();
      } catch (error) {
        res.json({message: "invalid token", error})
      } 
    } else {
      res.json({msg: 'Token required '});
    }
  }
}