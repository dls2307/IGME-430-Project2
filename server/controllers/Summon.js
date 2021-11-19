const models = require('../models');

const { Item } = models;

const summonPage = (req, res) => {
  res.render('app', { csrfToken: req.csrfToken() });
};

module.exports = {
    summonPage
  };
  