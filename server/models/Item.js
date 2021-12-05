const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let ItemModel = {};

const convertId = mongoose.Types.ObjectId;

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: Number,
    min: 1,
    required: true,
  },
  type: {
    type: Number,
    min: 0,
    max: 1,
    required: true,
  },
  rarity: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  weaponType: {
    type: String,
    required: true,
    trim: true,
  },
  element: {
    type: String,
    required: false,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

ItemSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  rarity: doc.rarity,
  weaponType: doc.weaponType,
  element: doc.element,
  quantity: doc.quantity,
  image: doc.image,
  type: doc.type,
});

ItemSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertId(ownerID),
  };

  return ItemModel.find(search).select('name rarity weaponType element image quantity type').lean().exec(callback);
};

ItemModel = mongoose.model('Item', ItemSchema);

module.exports = {
  ItemModel,
  ItemSchema,
};
