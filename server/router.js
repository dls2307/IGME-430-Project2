const controllers = require('./controllers');

const router = (app) => {
  app.get('/getToken', controllers.Account.getToken);
  app.get('/login', controllers.Account.loginPage);
  app.post('/login', controllers.Account.login);
  app.post('/signup', controllers.Account.signup);
  app.post('/changePass', controllers.Account.changePassword);
  app.get('/logout', controllers.Account.logout);
  app.get('/',controllers.Account.loginPage);
};

module.exports = router;