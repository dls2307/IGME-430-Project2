const models = require('../models');

const { Account } = models;

// Renders login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// Logs user out
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// Renders settings page
const settingsPage = (req, res) => {
  res.render('settings', { csrfToken: req.csrfToken() });
};

// Logs user in if valid info is sent
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'Error. All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Error. Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/summon' });
  });
};

// Retrieves CSRF Token
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

// Creates a new account
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'Error. All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Error. Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/summon' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Error. Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

// Changes passwords of the user
const changePassword = (request, response) => {
  const req = request;
  const res = response;

  req.body.oldPass = `${req.body.oldPass}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.oldPass || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'Error. All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Error. Both passwords are not the same' });
  }

  if (req.body.oldPass === req.body.pass) {
    return res.status(400).json({ error: 'Error. Old password and new password are the same' });
  }

  const { username } = req.session.account;

  return Account.AccountModel.authenticate(username, req.body.oldPass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Error. Incorrect password' });
    }

    return Account.AccountModel.generateHash(req.body.pass2, (salt, hash) => {
      console.log();
      return Account.AccountModel.updateOne({ username }, { salt, password: hash }, (othererr) => {
        if (othererr) {
          return res.status(400).json({ error: 'An error occurred' });
        }
        return res.status(200).json({ message: 'Password updated.' });
      });
    });
  });
};

// Changes the user's subscription-status
const subscribe = (request, response) => {
  const req = request;
  const res = response;

  req.session.account.subscribed = !req.session.account.subscribed;
  return res.status(200).json({ redirect: '/settings' });
};

// Returns if the user is subscribed or not.
const getSub = (req, res) => {
  const subscriptionStatus = req.session.account.subscribed;

  return res.json({ subscribed: subscriptionStatus });
};

// Deletes the user's account
const deleteAccount = (req, res) => {
  const filter = {
    _id: req.session.account._id,
  };
  return Account.AccountModel.deleteOne(filter, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }
    if (docs) {
      console.log(docs);
    }
    req.session.destroy();
    return res.status(200).json({ redirect: '/' });
  });
};

module.exports = {
  loginPage,
  logout,
  login,
  signup,
  getToken,
  changePassword,
  subscribe,
  getSub,
  settingsPage,
  deleteAccount,
};
