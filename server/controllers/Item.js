const genshin = require('genshin-db');
const models = require('../models');

const { Item } = models;

const bannerPage = (req, res) => res.render('app', { csrfToken: req.csrfToken() });

const pullItem = async (req, res) => {
  const genshinItem = genshin.characters('Amber');
  const itemData = {
    name: genshinItem.name,
    quantity: 1,
    type: 0,
    owner: req.session.account._id,
  };

  const newItem = new Item.ItemModel(itemData);

  const itemPromise = newItem.save();

  itemPromise.then(() => res.json({ genshinItem }));

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
};
