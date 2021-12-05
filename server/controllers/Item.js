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
    itemData = {
      name: genshinItem.name,
      rarity: genshinItem.rarity,
      weaponType: genshinItem.weapontype,
      quantity: 1,
      image: genshinItem.images.icon,
      type: 1,
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
  let pullRate = 100;
  if (isSubbed === true) {
    pullRate = 1000;
  }
  // If the resultNum is lower than 6, then it's a 5-star. The rate is doubled if-subscribed.
  const resultNum = Math.floor(Math.random() * 1000);

  let isFiveStar = false;
  if (resultNum <= pullRate) {
    isFiveStar = true;
  }

  while (results.length < 10) {
    pullCharacter(req, res, isFiveStar);
    if (isFiveStar) {
      isFiveStar = !isFiveStar;
    }
  }

  return res.status(200).json({ redirect: '/' });
};

const pullWeaponBanner = (req, res) => {
  results = [];

  const isSubbed = req.session.account.subscribed;
  let pullRate = 100;
  if (isSubbed === true) pullRate = 1000;
  // If the resultNum is lower than 6, then it's a 5-star. The rate is doubled if-subscribed.
  const resultNum = Math.floor(Math.random() * 1000);

  let isFiveStar = false;
  if (resultNum <= pullRate) {
    isFiveStar = true;
  }

  while (results.length < 10) {
    pullWeapon(req, res, isFiveStar);
    if (isFiveStar) {
      isFiveStar = !isFiveStar;
    }
  }

  return res.status(200).json({ redirect: '/' });
};

const getCharacters = (req, res) => {
  const filter = {
    owner: req.session.account._id,
    type: 0,
  };

  return Item.ItemModel.find(filter, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ characters: docs });
  });
};

const getWeapons = (req, res) => {
  const filter = {
    owner: req.session.account._id,
    type: 1,
  };

  return Item.ItemModel.find(filter, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ weapons: docs });
  });
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
  getCharacters,
  getWeapons,
  getItems,
  bannerPage,
  inventoryPage,
  getResults,
  deleteInventory,
};
