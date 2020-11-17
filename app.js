const express = require('express');
const app = express();
const postsRouter = require('./routes/posts');
const { User, Post } = require('./models/index.js');

app.set('view engine', 'pug');

app.use('/posts', postsRouter);

app.get('/', async (req, res) => {
  console.log('in the route handler');
  const users = await User.findAll();
  res.render('index', { title: 'Fakebook', users });
  // res.send('<h1>this is our express app</h1>');
});

app.get('/users/:id(\\d+)', async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id, { include: Post });
  res.render('profile', { user });
});

app.get('/test', (req, res) => {
  res.send('this is the test route');
});

app.get('/:state/:city', (req, res) => {
  console.log(req.params);
  res.send(`state: ${req.params.state}, city: ${req.params.city}`);
});

app.all('*', (req, res) => {
  res.statusCode = 404;
  res.send('oops, page not found');
});

app.listen(5000, () => console.log('express listening on port 5000!'));
