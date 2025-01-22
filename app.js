const express = require("express");

//initialize ejs
const expressLayouts = require("express-ejs-layouts");

const mongoose = require("mongoose");

const app = express();

//DB config
const db = require("./config/keys").MongoURI;

//connect to mongoose
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected...."))
  .catch((err) => console.log(err));

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparse
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5001;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
