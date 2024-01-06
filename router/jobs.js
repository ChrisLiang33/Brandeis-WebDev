//job routes
const router = require('express').Router();
const jobsController = require('../controllers/jobsController');
const job = require('../models/job');

router.get("/", jobsController.index, jobsController.indexView)
router.get("/new", jobsController.isloggedin,jobsController.new)
router.get("/:id", jobsController.show, jobsController.showView)
router.post("/create", jobsController.isloggedin,jobsController.validate, jobsController.create, jobsController.redirectView)
router.get("/:id/edit", jobsController.isloggedin,jobsController.edit)
router.delete("/:id/delete", jobsController.isloggedin,jobsController.delete, jobsController.redirectView)
router.put("/:id/update",jobsController.isloggedin,jobsController.update, jobsController.redirectView)

module.exports = router