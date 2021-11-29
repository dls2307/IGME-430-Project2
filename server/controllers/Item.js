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

  res.render('app', { csrfToken: req.csrfToken(), items: lastItems });
  return false;
};

const pullItem = async (req, res) => {
  // TODO: MAKE THIS RANDOMIZED FOR CHARACTERS/WEAPONS, NOT JUST RETURN AMBER
  const genshinItem = genshin.characters('Jean');
  lastItems = [];

  const itemData = {
    name: genshinItem.name,
    rarity: genshinItem.rarity,
    element: genshinItem.element,
    weaponType: genshinItem.weapontype,
    quantity: 1,
    type: 0,
    owner: req.session.account._id,
  };

  lastItems.push(itemData);

  const newItem = new Item.ItemModel(itemData);

  const itemPromise = newItem.save();

  itemPromise.then(() => {
    res.json({ redirect: '/results' });
  });

  itemPromise.catch(async (err) => {
    console.log(err);
    if (err.code === 11000) {
      await Item.ItemModel.updateOne({ name: itemData.name }, { $inc: { quantity: 1 } });
      return res.status(204).json({ message: 'Updated Successfully' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return itemPromise;
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
