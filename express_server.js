const express = require("express");
const { getUserByEmail, urlsForUser, longin, emailMatch, generateRandomString } = require("./helper.js");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

const urlDatabase = {"123nb5":{
  "longURL": "http://www.google.ca",
  "userID":"user3RandomID"
},
"1235y5":{
  "longURL": "http://www.hotmail.com",
  "userID":"user4RandomID"
}
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "user3RandomID": {
    id: "user3RandomID",
    email: "vazywon@hotmail.com",
    password: "hihi"
  }
};
app.get("/urls", (req, res) => {
  if (req.session.id === "" || req.session.id === false) {
    res.redirect("/login");
  }
  if (req.session.id) {
    let templateVars = { urls: urlsForUser(req.session.id, urlDatabase), email: req.session.email};
    res.render("urls_index", templateVars);
  }
});

app.get("/", (req,res) =>  {
  res.redirect("/urls");
});

app.get("/u/:id", (req, res) => {
  res.redirect(urlDatabase[req.params.id].longURL);
});

app.get("/urls/new", (req, res) => {
  if (req.session.email) {
    let templateVars = { urls: urlDatabase, email: req.session.email};
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL , longURL: urlDatabase[req.params.shortURL].longURL, email: req.session.email};
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls", (req, res) => {
  const sURL = generateRandomString();
  urlDatabase[sURL] = { longURL: req.body.longURL, userID: req.session.id };          // Respond with 'Ok' (we will replace this)
  res.redirect('/urls/' + sURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.session.id) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  } else {
    res.send('Error');
  }
});

app.post("/urls/:shortURL/edit", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL , longURL: urlDatabase[req.params.shortURL].longURL, email: req.session.email};
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/edited", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.session.id) {
    urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    res.redirect('/urls');
  } else {
    res.send("error");
  }
});

app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase, email: req.session.email};
  res.render("login", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = { urls: urlDatabase, email: req.session.email};
  res.render("register", templateVars);
});

app.post("/login", (req, res) => {
  const user = longin(req.body.id, req.body.password, users);
  if (user) {
    req.session.id = user["id"];
    req.session.email = user["email"];
    res.redirect("/urls");
  } else {
    res.send("Fail to log in: wrong email or password");
  }
  
});

app.get("/login/success", (req, res) => {
  let templateVars = { urls: urlDatabase, email: req.session.email};
  res.render("urls_index", templateVars);
});

app.post("/logout", (req, res) => {
  req.session.email = "";
  req.session.id = "";
  res.redirect("/login");
});

app.post("/register", (req,res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  req.session.id = id;
  req.session.email = email;
  if (email === "") {
    res.send("enter correct email address");
  }
  if (emailMatch(email)) {
    res.send("400 Status Code: Fail to Register (email alreay exists)");
  } else {
    users[id] = {
      id : id,
      email: email,
      password: password
    };
  }
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});