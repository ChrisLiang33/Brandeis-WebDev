//events routes
const router = require("express").Router()
const eventController = require("../controllers/eventController")

router.get("/", eventController.index, eventController.indexView)
router.get("/new", eventController.isloggedin,eventController.new)
router.get("/:id", eventController.show, eventController.showView)
router.post("/create", eventController.isloggedin,eventController.validate, eventController.create, eventController.redirectView)
router.get("/:id/edit", eventController.isloggedin,eventController.edit)
router.delete("/:id/delete", eventController.isloggedin,eventController.delete, eventController.redirectView)
router.put("/:id/update", eventController.isloggedin,eventController.update, eventController.redirectView)

module.exports = router