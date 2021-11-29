const genshin = require('genshin-db');
const models = require('../models');

const { Item } = models;

const bannerPage = (req, res) => res.render('app', { csrfToken: req.csrfToken() });

const pullItem = async (req, res) => {
  let updated = false;
  const genshinItem = genshin.characters('Amber');
  const itemData = {
    name: genshinItem.name,
    quantity: 1,
    type: 0,
    owner: req.session.account._id,
  };

  Item.ItemModel.findByOwner(req.session.account_id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    for (let i = 0; i < docs.length; i++) {
      if (docs[i].name === itemData.name) {
        updated = true;
        return Item.ItemModel.updateOne({ name: itemData.name, owner: itemData.owner }, { $inc: { quantity: 1 } });
      }
    }

    return 0;
  });
  if (updated !== true) {
    const newItem = new Item.ItemModel(itemData);

    const itemPromise = newItem.save();

    itemPromise.then(() => res.json({ genshinItem }));

    itemPromise.catch(async (err) => {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    });

    return itemPromise;
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

module.exports = {
  pullItem,
  getItems,
  bannerPage,
};
