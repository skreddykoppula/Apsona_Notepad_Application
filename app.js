const express = require("express");
require("dotenv").config();
const authRouter = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const connect = require("./config/db");
const bodyParser = require("body-parser");
const { requireAuth, checkUser } = require("./middleware/authmiddleware");

(async () => {
  try {
    await connect();
  } catch (error) {
    console.error("Error:", error);
  }
})();

app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("*", checkUser);
app.post("*", checkUser);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/notepad", requireAuth, (req, res) => {
  const theme = req.cookies.theme || "light";
  console.log(theme);
  res.render("notepad", { theme });
});
app.use(authRouter);

app.listen(process.env.PORT || 5000, (error) => {
  if (error) {
    return console.error(`Encountered error in starting the app ${error}`);
  }
  console.log(`Started listening to port ${process.env.PORT}`);
});
