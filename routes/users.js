const express = require('express');
const router = express.Router();
const { User, Post } = require('../models');

router.get('/register', csrfProtection, (req, res) => {
  console.log(req.csrfToken());
  res.render('new-user', { csrfToken: req.csrfToken() });
});

router.post('/', csrfProtection, async (req, res) => {
  console.log(req.body);
  const { username, email } = req.body;
  const user = await User.create({ username, email });
  console.log(req.likesBanana); // accessing the likesBanana property set in addToReq middleware
  res.redirect('/');
});

router.get('/:id(\\d+)', async (req, res) => {
  const id = req.params.id;
  const user = await User.findByPk(id, { include: Post });
  res.render('profile', { user });
});

module.exports = router;
