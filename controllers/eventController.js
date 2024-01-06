//event controller, handles all operations in event
const Event = require("../models/event")
const User = require("../models/user")
const httpStatus = require("http-status-codes");

module.exports = {
    //use to make sure logged in
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
    //index all fetch events
    index: (req, res, next) => {
        Event.find({})
            .then((events) => {
                res.locals.events = events
                next()
            })
            .catch((error) => {
                console.log(`Error featching events: ${error.message}`)
                next(error)
            })
    },
    //render indexView
    indexView: (req, res) => {
        res.render("events/index")
    },
    //render new
    new: (req, res) => {
        res.render("events/new")
    },
    //fetch events by id
    show: (req, res, next) => {
        let eventId = req.params.id
        Event.findById(eventId)
            .populate('organizer', "email")
            .populate('attendees', "email")
            .then((event) => {
                res.locals.event = event
                next()
            })
            .catch((error) => {
                console.log(`Error featching event by ID: ${error.message}`)
                next(error)
            })
    },
    //render show
    showView: (req, res) => {
        res.render("events/show")
    },
    //edit events by id
    edit: (req, res, next) => {
        let eventId = req.params.id;
        Event.findById(eventId)
            .populate('organizer', "email")
            .populate('attendees', "email")
            .then((event) => {
                res.render("events/edit", {
                    event: event
                })
            })
            .catch((error) => {
                console.log(`Error featching event by ID: ${error.message}`)
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
        let eventId = req.params.id
        Event.findByIdAndRemove(eventId)
            .then(() => {
                res.locals.redirect = "/events"
                req.flash(
                    "success",
                    `deleted successfully!`
                );
                next()
            })
            .catch((error) => {
                console.log(`Error deleting event by ID: ${error.message}`)
                next(error)
            })
    },
    //update by id, 
    update: (req, res, next) => {
        let eventId = req.params.id
        eventParams = {
            title: req.body.title,
            description: req.body.description,
            loction: req.body.location,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            isOnline: req.body.isOnline,
            registrrationLink: req.body.registrrationLink,
            organizer: req.body.organizer,
            attendees: req.body.attendees,
        }
        Event.findByIdAndUpdate(eventId, {
            $set: eventParams
        })
            .then((event) => {
                req.flash(
                    "success",
                    `updated successfully!`
                );
                res.locals.redirect = `/events/${eventId}`
                res.locals.event = event
                next()
            })
            .catch((error) => {
                console.log(`Error updating event by ID: ${error.message}`)
                next(error)
            })
    },
    //create event 
    create: (req, res, next) => {
        let currentonline = false
        let currentUser = req.user;
        if (req.body.isOnline == "on") {
            currentonline = true;
        }
        let eventParams = {
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            isOnline: currentonline,
            registrrationLink: req.body.registrrationLink,
        }
        eventParams.organizer = res.locals.currentUser._id;
        Event.create(eventParams)
            .then(event => {
                req.flash(
                    "success",
                    `event created successfully!`
                );
                res.locals.redirect = "/events"
                res.locals.event = event
                next()
            })
            .catch((error) => {
                console.log(`Error saving event: ${error.message}`)
                next(error)
            })
    },
    //validate incoming data
    validate: (req, res, next) => {
        console.log(req.body)
        req.check("title", "title cannot be empty").notEmpty();
        req.check("description", "description cannot be empty").notEmpty();
        req.check("location", "location cannot be empty").notEmpty();
        req.check("startDate", "startDate cannot be empty").notEmpty();
        req.check("endDate", "endDate cannot be empty").notEmpty();

        User.findOne([{ 'email': req.body.organizer }, function (err, user) {
            if (err) throw (err)
            console.log("We found the user")
        }])

        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                let messages = error.array().map((e) => e.msg);
                req.skip = true;
                req.flash("error", messages.join(" and "));
                res.locals.redirect = "/events/new";
                next();
            } else {
                next();
            }
        });
    },
    //respondjson
    respondJSON: (req, res) => {
        res.json({
            status: httpStatus.OK,
            data: res.locals,
        });
    },
    //errorjson
    errorJSON: (error, req, res, next) => {
        let errorObject;
        if (error) {
            errorObject = {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: error.message,
            };
        } else {
            errorObject = {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: "Unknown Error.",
            };
        }
        res.json(errorObject);
    },
    //join button and set current user to attendee
    join: (req, res, next) => {
        let eventId = req.params.id
        if (res.locals.currentUser) {
            Event.findByIdAndUpdate(eventId, {
                $addToSet: {
                    attendees: res.locals.currentUser._id
                },
            })
                .then(() => {
                    res.locals.success = true;
                    next();
                })
                .catch((error) => {
                    next(error);
                });
        } else {
            next(new Error("User must log in."));
        }
    },
}