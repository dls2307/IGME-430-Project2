const genshin = require('genshin-db');
const models = require('../models');

const { Item } = models;

let lastItems = [];

const bannerPage = (req, res) => res.render('app', { csrfToken: req.csrfToken() });
const inventoryPage = (req, res) => res.render('inventory', { csrfToken: req.csrfToken() });

const resultsAppPage = (req, res) => {
  if (lastItems.length === 0) {
    res.render('app', { csrfToken: req.csrfToken() });
    return false;
  }

  res.render('app', { csrfToken: req.csrfToken(), justSummoned: true });
  return false;
};

const pullItem = async (req, res) => {
  // TODO: MAKE THIS RANDOMIZED FOR CHARACTERS/WEAPONS, NOT JUST RETURN AMBER
  const genshinItem = genshin.characters('Hu Tao');
  lastItems = [];

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

  const filter = {
    name: itemData.name,
    owner: itemData.owner,
  };

  Item.ItemModel.findOneAndUpdate(filter, { $inc: { quantity: 1 } }, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }
    if (!docs) {
      lastItems.push(itemData);

      const newItem = new Item.ItemModel(itemData);

      const itemPromise = newItem.save();

      itemPromise.then(() => {
        res.json({ redirect: '/results' });
      });

      itemPromise.catch(async (newerr) => {
        console.log(newerr);
        return res.status(400).json({ error: 'An error occurred' });
      });

      return itemPromise;
    }
    return itemData;
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

module.exports = {
  pullItem,
  getItems,
  bannerPage,
  inventoryPage,
  resultsAppPage,
};
