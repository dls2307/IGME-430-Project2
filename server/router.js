const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/settings', mid.requiresLogin, controllers.Account.settings);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/pullCharacter', controllers.Item.pullCharacterBanner);
  app.get('/pullWeapon', controllers.Item.pullWeaponBanner);
  app.get('/summon', mid.requiresLogin, controllers.Item.bannerPage);
  app.get('/inventory', mid.requiresLogin, controllers.Item.inventoryPage);
  app.get('/getItems', mid.requiresLogin, controllers.Item.getItems);
  app.get('/results', mid.requiresLogin, controllers.Item.getResults);
  app.get('getSubscription', mid.requiresLogin, controllers.Account.getSubscription);
  app.post('/subscribe', mid.requiresLogin, controllers.Account.subscribe);
  app.post('/passChange', mid.requiresLogin, controllers.Account.changePassword);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
