const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userModel = require('./models/user'); // Import the user model

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/testapp1", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', function(req, res) {
  res.render("index");
});

app.get('/read', async (req, res) => {
  try {
    let users = await userModel.find();
    res.render("read", { users });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/edit/:userid', async (req, res) => {
  try {
    let user = await userModel.findOne({ _id: req.params.userid });
    res.render("edit", { user });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/update/:userid', async (req, res) => {
  let { name, email, image } = req.body;
  try {
    await userModel.findOneAndUpdate(
      { _id: req.params.userid },
      { name, email, image },
      { new: true }
    );
    res.redirect("/read");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/delete/:id', async (req, res) => {
  try {
    await userModel.findOneAndDelete({ _id: req.params.id });
    res.redirect("/read");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/create', async (req, res) => {
  let { name, email, image } = req.body;
  try {
    await userModel.create({ name, email, image });
    res.redirect("/read");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
