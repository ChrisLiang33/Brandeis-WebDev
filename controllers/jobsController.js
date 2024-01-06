//job operations 
const Job = require("../models/job")

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
    //index all fetch jobs
    index: (req, res, next) => {
        Job.find({})
            .then((jobs) => {
                res.locals.jobs = jobs
                next()
            })
            .catch((error) => {
                console.log(`Error featching jobs: ${error.message}`)
                next(error)
            })
    },
    //render indexView
    indexView: (req, res) => {
        res.render("jobs/index")
    },
    //render new
    new: (req, res) => {
        res.render("jobs/new")
    },
    //fetch jobs by id
    show: (req, res, next) => {
        let jobId = req.params.id
        Job.findById(jobId)
            .then((job) => {
                res.locals.job = job
                next()
            })
            .catch((error) => {
                console.log(`Error featching job by ID: ${error.message}`)
                next(error)
            })
    },
    //render show
    showView: (req, res) => {
        res.render("jobs/show")
    },
    //edit job by id
    edit: (req, res, next) => {
        let jobId = req.params.id;
        Job.findById(jobId)
            .then((job) => {
                res.render("jobs/edit", {
                    job: job
                })
            })
            .catch((error) => {
                console.log(`Error featching job by ID: ${error.message}`)
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
        let jobId = req.params.id
        Job.findByIdAndRemove(jobId)
            .then(() => {
                res.locals.redirect = "/jobs"
                req.flash(
                    "success",
                    `deleted successfully!`
                );
                next()
            })
            .catch((error) => {
                console.log(`Error deleting job by ID: ${error.message}`)
                next(error)
            })
    },
    //update by id, 
    update: (req, res, next) => {
        let jobId = req.params.id
        jobParams = {
            name: req.body.name,
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            description: req.body.description,
            requirements: req.body.requirements,
            salary: req.body.salary,
            contactEmail: req.body.contactEmail,
            contactPhone: req.body.contactPhone,
            postDate: req.body.postDate,
            deadlineDate: req.body.deadlineDate,
            isActive: req.body.isActive,
        }
        Job.findByIdAndUpdate(jobId, {
            $set: jobParams
        })
            .then((job) => {
                req.flash(
                    "success",
                    `updated successfully!`
                );
                res.locals.redirect = `/jobs/${jobId}`
                res.locals.job = job
                next()
            })
            .catch((error) => {
                console.log(`Error updating job by ID: ${error.message}`)
                next(error)
            })
    },
    //create event
    create: (req, res, next) => {
        let jobParams = {
            name: req.body.name,
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            description: req.body.description,
            requirements: req.body.requirements,
            salary: req.body.salary,
            contactEmail: req.body.contactEmail,
            contactPhone: req.body.contactPhone,
            postDate: req.body.postDate,
            deadlineDate: req.body.deadlineDate,
            isActive: req.body.isActive,
        }
        Job.create(jobParams)
            .then(job => {
                req.flash(
                    "success",
                    `event created successfully!`
                );
                res.locals.redirect = "/jobs"
                res.locals.job = job
                next()
            })
            .catch((error) => {
                console.log(`Error saving job: ${error.message}`)
                next(error)
            })
    },
    // validate incoming data 
    validate: (req, res, next) => {
        req.check("title", "title cannot be empty").notEmpty();
        req.check("company", "company cannot be empty").notEmpty();
        req.check("location", "location cannot be empty").notEmpty();
        req.check("description", "description cannot be empty").notEmpty();
        req.check("requirements", "requirements cannot be empty").notEmpty();
        req.check("salary", "salary cannot be empty").notEmpty();
        req.check("salary", "salaryshould be numbers").isInt();
        req.check("contactEmail", "contactEmail cannot be empty").notEmpty();
        req.check("contactEmail", "contactEmail is invalid").isEmail();
        req.check("contactPhone", "contactPhone cannot be empty").notEmpty();
        req.check("contactPhone", "contactPhone should be numbers").isInt();
        req.check("deadlineDate", "deadlineDate cannot be empty").notEmpty();

        req.getValidationResult().then((error) => {
            if (!error.isEmpty()) {
                let messages = error.array().map((e) => e.msg);
                req.skip = true;
                req.flash("error", messages.join(" and "));
                res.locals.redirect = "/jobs/new";
                next();
            } else {
                next();
            }
        });
    },
}