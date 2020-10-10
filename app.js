const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require("dotenv").config();
require("./models/db");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.locals.__global = {
  default_header: path.join(
    __dirname,
    "views/templates/default_template/header.ejs",
  ),
  default_footer: path.join(
    __dirname,
    "views/templates/default_template/footer.ejs",
  ),
  template: path.join(__dirname, "views/templates"),
  linkCSS: path.join(__dirname, "views/partials/link_files/css.ejs"),
  linkJS: path.join(__dirname, "views/partials/link_files/js.ejs"),
};

app.locals.app_css = ["libraries/bootstrap.min", "style"];
app.locals.app_js = [
  "libraries/jquery.min",
  "libraries/bootstrap.bundle.min",
  "libraries/fontawesome.kit",
];

app.use("/css", express.static(path.join(__dirname, "public/stylesheets")));
app.use("/js", express.static(path.join(__dirname, "public/javascripts")));
app.use("/img", express.static(path.join(__dirname, "public/images")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
