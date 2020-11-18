const express = require('express');
const app = express();
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const postsRouter = require('./routes/posts');
const { User, Post } = require('./models/index.js');

app.set('view engine', 'pug');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const csrfProtection = csrf({ cookie: true });

function logReqData(req, res, next) {
  console.log('HTTP METHOD:', req.method);
  console.log('PATH:', req.path);
  next();
}

function addToReq(req, res, next) {
  if (req.body.username === 'fred') {
    req.isFred = true;
  } else {
    req.isFred = false;
  }
  next();
}

app.use(logReqData);
app.use(addToReq);

app.use('/posts', postsRouter);

app.get('/', async (req, res) => {
  console.log('in the route handler');
  const users = await User.findAll();
  res.render('index', { title: 'Fakebook', users });
  // res.send('<h1>this is our express app</h1>');
});

app.get('/register', csrfProtection, (req, res) => {
  console.log(req.csrfToken());
  res.render('new-user', { csrfToken: req.csrfToken() });
});

app.post('/users', csrfProtection, async (req, res) => {
  console.log(req.body);
  const { username, email } = req.body;
  const user = await User.create({ username, email });
  if (req.isFred) {
    return res.send('fred just registered');
  }
  res.redirect('/');
});

app.get('/users/:id(\\d+)', async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id, { include: Post });
  res.render('profile', { user });
});

app.get('/test', (req, res) => {
  res.send('this is the test route');
});

// app.get('/:state/:city', (req, res) => {
//   console.log(req.params);
//   res.send(`state: ${req.params.state}, city: ${req.params.city}`);
// });

app.all('*', (req, res) => {
  res.statusCode = 404;
  res.send('oops, page not found');
});

app.listen(5000, () => console.log('express listening on port 5000!'));
