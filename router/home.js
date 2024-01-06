//home routes
const router = require("express").Router()
const homeController = require("../controllers/homeController")

router.get("/", homeController.indexPage);
router.get("/index", homeController.indexPage);
router.get("/about", homeController.aboutPage);
router.get("/contact", homeController.contactPage);
router.post("/contact", homeController.thankyoupage)
router.get("/chat", homeController.isloggedin, homeController.chat)

module.exports = router;