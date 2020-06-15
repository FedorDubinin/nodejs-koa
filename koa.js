const http = require("http");

const Koa = require("koa");
const cors = require("koa2-cors");
const Router = require("koa2-router");
const passport = require("koa-passport");
const bodyParser = require("koa-bodyparser");

const LocalStrategy = require("passport-local").Strategy;

const options = {
  usernameField: "email",
  passwordField: "password",
  session: false,
};

const users = [
  {
    id: 1,
    email: "test@gmail.com",
    firstName: "Koa",
    lastName: "Example"
  }
]

const checkUser = (username, password) => {
  let user = users.map(u => {
    if (u.email === username) {
      return u;
    }
  })[0];

  return user;
};

passport.use(new LocalStrategy(options, (username, password, done) => {
  const user = checkUser(username, password);
  if (user) {
    done(null, { ...user });
  } else {
    done(null, false);
  }
}));

const app = new Koa();

const router = new Router();

router.get("/ping", ctx => {
  ctx.status = 200;
  ctx.body = { text: "pong" }
});

router.post("/user/login", ctx => {
  return passport.authenticate("local", (err, user) => {
    if (!user) {
      ctx.status = 404;
      throw new Error("User not found")
    }

    ctx.status = 200;
    ctx.body = { user };
  })(ctx);
});

router.get("/user/check-auth", ctx => {
  // Write your code
})


app.use(cors({
    credentials: true
}));

app.use(bodyParser());

app.use(passport.initialize());

app.use(router);

const server = http.Server(app.callback());
server.listen(4500);