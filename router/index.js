//routes index
const router = require("express").Router(),
userRoutes = require("./users"),
jobRoutes = require("./jobs"),
eventRoutes = require("./events"),
errorRoutes = require("./error"),
homeRoutes = require("./home"),
apiRoutes = require("./api");

router.use("/users",userRoutes);
router.use("/jobs",jobRoutes);
router.use("/events", eventRoutes);
router.use("/api", apiRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;