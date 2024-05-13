const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

app.use(session({
  secret: 'geheimnisvollesGeheimnis',
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));

const users = [
  { username: 'benutzer1', password: 'passwort1' },
  { username: 'benutzer2', password: 'passwort2' }
];

function authenticate(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).send('Unauthorized');
  }
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    req.session.user = user;
    res.send('Login successful');
  } else {
    res.status(401).send('Invalid username or password');
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.send('Logout successful');
});

app.get('/protected', authenticate, (req, res) => {
  res.send('Protected route');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
