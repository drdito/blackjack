const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exphbs = require("express-handlebars");
const passportSetup = require('./config/passport-setup');
const authRoutes = require('./routes/auth-routes');
const gameRoutes = require('./routes/game-routes');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
const passport = require('passport');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static('public'));

app.engine("handlebars", exphbs({
    defaultLayout: "main",
    helpers: {
      json: function (context) {
        return JSON.stringify(context);
      }
    }
}));
app.set("view engine", "handlebars");

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', authRoutes);
app.use('/game', gameRoutes);

app.get('/', (req, res) => {
  res.render('home');
});



app.listen(3000, ()=> {
  console.log("Server is listening on port 3000!");
});