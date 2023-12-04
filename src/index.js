const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const route = require("./routes");
const db = require("./config/db");

db.connect();
const POST = process.env.PORT || 8080
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

route(app);

app.listen(POST, () => {
  console.log(`server listening on ${POST}`);
});
