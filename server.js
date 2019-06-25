const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

// Config for Body-Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Router
const Users = require("./routes/api/users");
const Post = require("./routes/api/post");
const Profile = require("./routes/api/profile");

const db = require("./config/key").MongoDBURL;

// Connect mongodb database
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("DataBase is connected"))
  .catch(err => console.log(err));

// Other routes
app.use("/api/users", Users);
app.use("/api/profile", Profile);
app.use("/api/post", Post);

// Default Router

// PORT variable
const PORT = process.env.PORT || 5000;

// Server listen
app.listen(PORT, console.log(`server is running on ${PORT}`));
