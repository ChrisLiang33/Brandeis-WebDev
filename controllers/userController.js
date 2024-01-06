// user operations 
const User = require("../models/user")
const passport = require("passport")
const token = process.env.TOKEN || "recipeT0k3n";

const userParams = (body) => {
    return {
        name: body.name,
        email: body.email,
        password: body.password,
        role: body.role,
        graduationYear: body.graduationYear,
        major: body.major,
        job: body.job,
        company: body.company,
        city: body.city,
        state: body.state,
        country: body.country,
        zipCode: body.zipCode,
        bio: body.bio,
        interests: body.interests
    };
}

module.exports = {
    //make sure its logged in 
    isloggedin: (req, res, next) => {
        if (req.isAuthenticated()) {
            next()
        }
        else {
            req.flash(
                "error",
                `Need to log in first`
            );
            res.redirect("/users/login");
        }
    },
    //fatch all user
    index: (req, res, next) => {
        User.find({})
            .then((users) => {
                res.locals.users = users
                next()
            })
            .catch((error) => {
                console.log(`Error featching users: ${error.message}`)
                next(error)
            })
    },
    //render indexView
    indexView: (req, res) => {
        res.render("users/index")
    },
    //render new
    new: (req, res) => {
        res.render("users/new")
    },
    //fatch useer by id
    show: (req, res, next) => {
        let userId = req.params.id
        User.findById(userId)
            .then((user) => {
                res.locals.user = user
                next()
            })
            .catch((error) => {
                console.log(`Error featching user by ID: ${error.message}`)
                next(error)
            })
    },
    //rendeer view
    showView: (req, res) => {
        res.render("users/show")
    },
    //edit by user id
    edit: (req, res, next) => {
        let userId = req.params.id;
        User.findById(userId)
            .then((user) => {
                res.render("users/edit", {
                    user: user
                })
            })
            .catch((error) => {
                console.log(`Error featching user by ID: ${error.message}`)
                next(error)
            })
    },
    //update by id
    update: (req, res, next) => {
        let userId = req.params.id
        User.findByIdAndUpdate(userId, {
            $set: userParams
        })
            .then((user) => {
                req.flash(
                    "success",
                    `updated successfully!`
                );
                res.locals.redirect = `/users/${userId}`
                res.locals.user = user
                next()
            })
            .catch((error) => {
                console.log(`Error updating user by ID: ${error.message}`)
                next(error)
            })
    },
    //redirect view
    redirectView: (req, res, next) => {
        req.flash(
            "success",
            `redirect successfully!`
        );
        let redirectPath = res.locals.redirect
        if (redirectPath) res.redirect(redirectPath)
        else next()
    },
    //delete by id
    delete: (req, res, next) => {
        let userId = req.params.id
        User.findByIdAndRemove(userId)
            .then(() => {
                res.locals.redirect = "/users"
                req.flash(
                    "success",
                    `deleted successfully!`
                );
                next()
            })
            .catch((error) => {
                console.log(`Error deleting user by ID: ${error.message}`)
                next(error)
            })
    },
    create: (req, res, next) => {
        if (req.skip) return next();
        let newUser = new User(userParams(req.body));
        User.register(newUser, req.body.password, (error, user) => {
            if (user) {
                req.flash(
                    "success",
                    `${user.fullName}'s account created successfully!`
                );
                res.locals.redirect = "/users";
                next();
            } else {
                req.flash(
                    "error",
                    `Failed to create user account because: ${error.message}.`
                );
                res.locals.redirect = "/users/new";
                next();
            }
        });
    },
    //render login
    login: (req, res) => {
        res.render("users/login");
    },
    //authenticate
    authenticate: passport.authenticate("local", {
        failureRedirect: "/users/login",
        failureFlash: "Failed to login.",
        successRedirect: "/",
    }),
    //logout
    logout: (req, res, next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            req.flash("success", "You have been logged out!");
            res.locals.redirect = "/";
            next();
        });
    },
    //validate incoming data
    validate: (req, res, next) => {
        req.check("name", "name cannot be empty").notEmpty();
        req.sanitizeBody("email").trim();
        req.check("email", "email cannot be empty").notEmpty();
        req.check("email", "Email is invalid").isEmail();
        req.check("password", "Password cannot be empty").notEmpty();
        req.check("graduationYear", "graduationYear should have 4 digits").isLength({
            min: 4,
            max: 4,
        });
        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                let messages = error.array().map((e) => e.msg);
                req.skip = true;
                req.flash("error", messages.join(" and "));
                res.locals.redirect = "/users/new";
                next();
            } else {
                next();
            }
        });
    },
    //varify token
    verifyToken: (req, res, next) => {
        try {
            let token = req.query.apiToken;
            if (token) {
                User.findOne({ apiToken: token })
                    .then((user) => {
                        if (user) next();
                        else next(new Error("Invalid API token."));
                    })
                    .catch((error) => {
                        next(new Error(error.message));
                    });
            } else {
                next(new Error("Invalid API token."));
            }
        } catch (error) {
            console.log(error)
        }
    },
}

