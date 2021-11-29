const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/pullItem', controllers.Item.pullItem);
  app.get('/summon', mid.requiresLogin, controllers.Item.bannerPage);
  app.get('/inventory', mid.requiresLogin, controllers.Item.inventoryPage);
  app.get('/getItems', mid.requiresLogin, controllers.Item.getItems);
  app.get('/results', mid.requiresLogin, controllers.Item.resultsAppPage);
  /* app.post('/changePass', mid.requiresLogin, controllers.Account.changePassword); */
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
