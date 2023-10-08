const express = require("express");
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const { validationResult, check } = require('express-validator');
const db = require("./models");
const secretKey = "E3#fd&jKs^2P$lmnGhT4*qR@W5tYzXv";

const userRoute = require("./routes/user");
const projectRoute = require("./routes/project");
const taskRoute = require("./routes/task");

const app = express();
const env = process.env.NODE_ENV || 'development';

const configurePassport = require('./config/passport-config'); 
configurePassport(passport); 

app.use(bodyParser.json());
app.use(session({ secret:  secretKey, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

db.sequelize.sync().then(() => {
  console.log('Database is synchronized.');
}).catch((err) => {
  console.error('Error syncing database:', err);
});

app.use("/api/users", userRoute);
app.use("/api/projects", projectRoute);
app.use("/api/tasks", taskRoute);


app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON' });
  }

  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;