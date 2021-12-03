const genshin = require('genshin-db');
const models = require('../models');

const { Item } = models;

const bannerPage = (req, res) => res.render('app', { csrfToken: req.csrfToken() });
const inventoryPage = (req, res) => res.render('inventory', { csrfToken: req.csrfToken() });

let results = [];

const pullCharacter = (req, res, characterName) => {
  // TODO: MAKE THIS RANDOMIZED FOR CHARACTERS/WEAPONS, NOT JUST RETURN AMBER
  const genshinItem = genshin.characters(characterName);

  const itemData = {
    name: genshinItem.name,
    rarity: genshinItem.rarity,
    element: genshinItem.element,
    weaponType: genshinItem.weapontype,
    quantity: 1,
    image: genshinItem.images.icon,
    type: 0,
    owner: req.session.account._id,
  };

  results.push(itemData);

  const filter = {
    name: itemData.name,
    owner: itemData.owner,
  };

  Item.ItemModel.findOneAndUpdate(filter, { $inc: { quantity: 1 } }, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }
    if (!docs) {
      const newItem = new Item.ItemModel(itemData);

      const itemPromise = newItem.save();

      itemPromise.then(() => {
        res.json({ redirect: '/' });
      });

      itemPromise.catch((othererr) => {
        console.log(othererr);
        return res.status(400).json({ error: 'An error occurred' });
      });

      return itemPromise;
    }
    return res.status(200).json({ redirect: '/' });
  });
};

const pullWeapon = (req, res, weaponName) => {
  // TODO: MAKE THIS RANDOMIZED FOR CHARACTERS/WEAPONS, NOT JUST RETURN AMBER
  const genshinItem = genshin.characters(weaponName);

  const itemData = {
    name: genshinItem.name,
    rarity: genshinItem.rarity,
    quantity: 1,
    image: genshinItem.images.icon,
    type: 1,
    owner: req.session.account._id,
  };

  results.push(itemData);

  const filter = {
    name: itemData.name,
    owner: itemData.owner,
  };

  Item.ItemModel.findOneAndUpdate(filter, { $inc: { quantity: 1 } }, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }
    if (!docs) {
      const newItem = new Item.ItemModel(itemData);

      const itemPromise = newItem.save();

      itemPromise.then(() => {
        res.json({ redirect: '/' });
      });

      itemPromise.catch((othererr) => {
        console.log(othererr);
        return res.status(400).json({ error: 'An error occurred' });
      });

      return itemPromise;
    }
    return res.status(200).json({ redirect: '/' });
  });
};

const pullCharacterBanner = (req, res) => {
  results = [];
  const characterList = genshin.characters('names', { matchCategories: true });
  for (let i = 0; i < 10; i++) {
    pullCharacter(req, res, characterList[Math.floor(Math.random() * characterList.length)]);
  }
};

const pullWeaponBanner = (req, res) => {
  results = [];
  const weaponList = genshin.weapons('names', { matchCategories: true });
  for (let i = 0; i < 10; i++) {
    pullWeapon(req, res, weaponList[Math.floor(Math.random() * weaponList.length)]);
  }
};

const getItems = (request, response) => {
  const req = request;
  const res = response;

  return Item.ItemModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ items: docs });
  });
};

const getResults = (request, response) => {
  const res = response;
  return res.json({ results });
};

module.exports = {
  pullCharacter,
  pullCharacterBanner,
  pullWeapon,
  pullWeaponBanner,
  getItems,
  bannerPage,
  inventoryPage,
  getResults,
};
