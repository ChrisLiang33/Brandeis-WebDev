//api routes
const router = require("express").Router()
const eventController = require("../controllers/eventController");
const usersController = require("../controllers/userController");

router.get("/events", eventController.index, eventController.respondJSON);
router.get(
    "/events/:id/join",
    eventController.join,
    eventController.respondJSON
);
router.use(eventController.errorJSON);
module.exports = router;
