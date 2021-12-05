const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/settings', mid.requiresLogin, controllers.Account.settingsPage);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/pullCharacter', controllers.Item.pullCharacterBanner);
  app.get('/pullWeapon', controllers.Item.pullWeaponBanner);
  app.get('/summon', mid.requiresLogin, controllers.Item.bannerPage);
  app.get('/getCharacters', mid.requiresLogin, controllers.Item.getCharacters);
  app.get('/getWeapons', mid.requiresLogin, controllers.Item.getWeapons);
  app.get('/inventory', mid.requiresLogin, controllers.Item.inventoryPage);
  app.get('/getItems', mid.requiresLogin, controllers.Item.getItems);
  app.get('/getResults', mid.requiresLogin, controllers.Item.getResults);
  app.get('/getSub', mid.requiresLogin, controllers.Account.getSub);
  app.post('/subscribe', mid.requiresLogin, controllers.Account.subscribe);
  app.post('/passChange', mid.requiresLogin, controllers.Account.changePassword);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.delete('/deleteInventory', mid.requiresLogin, controllers.Item.deleteInventory);
  app.delete('/deleteAccount', mid.requiresLogin, controllers.Account.deleteAccount);
};

module.exports = router;
