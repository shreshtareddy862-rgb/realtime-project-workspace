module.exports = function(requiredRole){

  return (req,res,next)=>{

    if(!req.user){
      return res.status(401).send("Unauthorized");
    }

    if(req.user.role !== requiredRole){
      return res.status(403).send("Access denied");
    }

    next();
  };

};