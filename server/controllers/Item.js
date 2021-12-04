const genshin = require('genshin-db');
const models = require('../models');

const { Item } = models;

const bannerPage = (req, res) => {
  let bannerInfo = {
    'type': "character",
    'fiveStarFocus': [
      "Albedo"
    ],
    'fourStarFocus': [
      "Thoma",
      "Sayu",
      "Rosaria",
    ]
  };

  res.render('app', { csrfToken: req.csrfToken(), bannerInfo });
};

const inventoryPage = (req, res) => res.render('inventory', { csrfToken: req.csrfToken() });

const pullItem = async (req, res) => {
  // TODO: MAKE THIS RANDOMIZED FOR CHARACTERS/WEAPONS, NOT JUST RETURN AMBER
  const genshinItem = genshin.characters('Jean');

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
      const newItem = new Item.ItemModel(itemData);

      const itemPromise = newItem.save();

      itemPromise.then(() => {
        res.json({ redirect: '/' });
      });

      itemPromise.catch(async (othererr) => {
        console.log(othererr);
        return res.status(400).json({ error: 'An error occurred' });
      });

      return itemPromise;
    }
    return res.status(200).json({ redirect: '/' });
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
};
