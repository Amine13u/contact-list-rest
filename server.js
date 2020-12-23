const express = require("express");
const app = express();
require("dotenv").config({ path: __dirname + "/config/.env" });
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");

const port = process.env.PORT || 3000;
const localhost = process.env.HOST;

app.use(cors());
app.use(express.json());

mongoose
  .connect(localhost, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("The Database is connected ..."))
  .catch((err) => console.log(err));

app.get("/api/users", (req, res) => {
  User.find({}, function (error, users) {
    if (error) {
      res.send("Oups, Something went wrong !!!");
    }
    res.send(users);
  });
});

app.post("/api/add_user", function (req, res) {
  let user = new User(req.body);
  user
    .save()
    .then((user) => {
      res.send("User saved to the database");
    })
    .catch((err) => {
      res.status(400).send("Unable to save to the database");
    });
});

app.put("/api/:userId", (req, res) => {
  User.updateOne({ _id: req.params.userId }, req.body).then((doc) =>
    res.status(200).json(doc)
  );
});

app.delete("/api/:userId", (req, res) => {
  User.findByIdAndRemove(req.params.userId).then((doc) =>
    res.status(204).end()
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
