const auth = {
    protected(req,res, next){
        if(req.session.user){
            next();
        } else {
            res.redirect("/");
        }
    },
    notLoggedIn(req,res,next){
        if(req.session.user){
            res.redirect("/");
        } else {
            next();
        }
    },
    isAdmin(req,res,next){
        if(req.session.user.isAdmin){
            next();
        } else {
            res.redirect("/");
        }
    }
}

export default auth;