const genshin = require('genshin-db');
const models = require('../models');

const { Item } = models;

const bannerPage = (req, res) => {
  res.render('app', { csrfToken: req.csrfToken() });
};
const inventoryPage = (req, res) => res.render('inventory', { csrfToken: req.csrfToken() });

let results = [];

const pullCharacter = (req, res, isFiveStar) => {
  const characterList = genshin.characters('names', { matchCategories: true });
  let desiredRarity = '4';
  if (isFiveStar) desiredRarity = '5';

  let itemData = {};

  while (itemData.rarity !== desiredRarity) {
    const characterName = characterList[Math.floor(Math.random() * characterList.length)];
    const genshinItem = genshin.characters(characterName);
    // console.log(itemData.rarity);
    itemData = {
      name: genshinItem.name,
      rarity: genshinItem.rarity,
      element: genshinItem.element,
      weaponType: genshinItem.weapontype,
      quantity: 1,
      image: genshinItem.images.icon,
      type: 0,
      owner: req.session.account._id,
    };
  }

  let dupeCheck = false;

  for (let i = 0; i < results.length; i++) {
    if (results[i].name === itemData.name) {
      dupeCheck = true;
      return;
    }
  }

  console.log(results.length);
  console.log('');

  if (dupeCheck === false) {
    results.push(itemData);
  }

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
        // res.status(202).json({ redirect: '/' });
      });

      itemPromise.catch((othererr) => {
        console.log(othererr);
        return res.status(400).json({ error: 'An error occurred' });
      });

      return itemPromise;
    }

    return false;
  });
};

const pullWeapon = (req, res, isFiveStar) => {
  const weaponList = genshin.weapons('names', { matchCategories: true });
  let desiredRarity = '4';
  if (isFiveStar) desiredRarity = '5';

  let itemData = {};

  while (itemData.rarity !== desiredRarity) {
    const weaponName = weaponList[Math.floor(Math.random() * weaponList.length)];
    const genshinItem = genshin.weapons(weaponName);
    // console.log(itemData.rarity);
    itemData = {
      name: genshinItem.name,
      rarity: genshinItem.rarity,
      element: genshinItem.element,
      weaponType: genshinItem.weapontype,
      quantity: 1,
      image: genshinItem.images.icon,
      type: 0,
      owner: req.session.account._id,
    };
  }

  let dupeCheck = false;

  for (let i = 0; i < results.length; i++) {
    if (results[i].name === itemData.name) {
      dupeCheck = true;
    }
  }

  if (dupeCheck === false) {
    results.push(itemData);
  }

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
        // res.json({ redirect: '/' });
      });

      itemPromise.catch((othererr) => {
        console.log(othererr);
        return res.status(400).json({ error: 'An error occurred' });
      });

      return itemPromise;
    }

    return false;
  });
};

const pullCharacterBanner = (req, res) => {
  results = [];

  const isSubbed = req.session.account.subscribed;
  let pullRate = 6;
  if (isSubbed === true) pullRate = 12;
  // If the resultNum is lower than 6, then it's a 5-star. The rate is doubled if-subscribed.
  const resultNum = Math.floor(Math.random() * 1000);

  let isFiveStar = false;
  if (resultNum <= pullRate) {
    isFiveStar = true;
  }

  while (results.length < 10) {
    pullCharacter(req, res, isFiveStar);
  }

  return res.status(200).json({ redirect: '/' });
};

const pullWeaponBanner = (req, res) => {
  results = [];

  const isSubbed = req.session.account.subscribed;
  let pullRate = 6;
  if (isSubbed === true) pullRate = 12;
  // If the resultNum is lower than 6, then it's a 5-star. The rate is doubled if-subscribed.
  const resultNum = Math.floor(Math.random() * 1000);

  let isFiveStar = false;
  if (resultNum <= pullRate) {
    isFiveStar = true;
  }

  while (results.length < 10) {
    pullWeapon(req, res, isFiveStar);
  }

  return res.status(200).json({ redirect: '/' });
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

const deleteInventory = (req, res) => {
  const filter = {
    username: req.session.account,
  };

  return Item.ItemModel.deleteMany(filter, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.status(200).json({ message: 'Inventory deleted successfully.' });
  });
};

const getResults = (req, res) => res.json({ results });

module.exports = {
  pullCharacter,
  pullCharacterBanner,
  pullWeapon,
  pullWeaponBanner,
  getItems,
  bannerPage,
  inventoryPage,
  getResults,
  deleteInventory,
};
