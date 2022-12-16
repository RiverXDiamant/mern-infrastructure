const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
// Always require and configure near the top
require("dotenv").config();
// Connect to the database
require("./config/database");

const app = express();

app.use(logger("dev"));
// there's no need to mount express.urlencoded middleware
app.use(express.json());

// Configure both serve-favicon & static middleware
app.use(favicon(path.join(__dirname, "build", "favicon.ico")));
// to serve from the production 'build' folder
app.use(express.static(path.join(__dirname, "build")));

// checkToken Middleware
// Middleware to verify token and assign user object of payload to req.user.
// Be sure to mount before routes
app.use(require("./config/checkToken"));

// * Put API routes here, before the "catch all" route \\
app.use("/api/users", require("./routes/api/users"));

// Protect the API routes below from anonymous users
const ensureLoggedIn = require("./config/ensureLoggedIn");
app.use("/api/items", ensureLoggedIn, require("./routes/api/items"));
app.use("/api/orders", ensureLoggedIn, require("./routes/api/orders"));

// The following "catch all" route (note the *) is necessary
// to return the index.html on all non-AJAX requests
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Configure to use port 3001 instead of 3000 during
// development to avoid collision with React's dev server
const PORT = process.env.PORT || 3001;

app.listen(PORT, function () {
  console.log(`Express app running on port: ${PORT} ✔️`);
});
