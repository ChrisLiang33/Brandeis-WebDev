// main index file 

const mongoose = require("mongoose")
const express = require("express")
const methodOverride = require("method-override")
const layouts = require("express-ejs-layouts")
const connectFlash = require("connect-flash")
const cookieParser = require("cookie-parser")
const expressSession = require("express-session")
const expressValidator = require("express-validator")
const passport = require("passport")
const User = require("./models/user")
const router = require("./router/index")
const socketio = require("socket.io")
const chatController = require("./controllers/chatController")
const morgan = require("morgan")

const app = express()
const PORT = process.env.PORT || 8080;

mongoose.connect("mongodb://localhost:27017/recipe_db")
const db = mongoose.connection
db.once('open', () => {
  console.log('Successfully connected to mongodb!')
})

app.use(morgan(":method :url :status * :response-time ms"));
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded())
app.set('view engine', 'ejs')
app.use(layouts)
app.use(expressValidator())
app.use(
  methodOverride('_method', {
    methods: ["POST", "GET"]
  })
)
app.use(cookieParser('secret-passcode'))
app.use(
  expressSession({
    secret: 'secret_passcode',
    cookie: {
      maxAge: 40000,
    },
    resave: false,
    saveUninitialized: false,
  }),
)
app.use(connectFlash())
app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.flashMessages = req.flash()
  res.locals.loggedIn = req.isAuthenticated()
  res.locals.currentUser = req.user
  next()
})

app.use("/", router)

const server = app.listen(PORT, () => {
  console.log("application is running");
});

const io = socketio(server);
chatController(io);