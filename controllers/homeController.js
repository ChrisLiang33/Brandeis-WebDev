//home operations 
module.exports = {
    indexPage: (req, res) => {
        res.render("index");
    },
    aboutPage: (req, res) => {
        res.render("about");
    },
    contactPage: (req, res) => {
        res.render("contact");
    },
    thankyoupage: (req, res) => {
        res.render("thankyou");
    },
    chat: (req, res) => {
        res.render("chat");
    },
    isloggedin: (req, res, next)=>{
        if(req.isAuthenticated()){
            next()
        }
        else{
            req.flash(
                "error",
                `Need to log in first`
            );
            res.redirect("/users/login");
        }
    },
}
