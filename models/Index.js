//to handel missing files wella kayen erreur during the require ta3o
const safeRequire = (path) => {
  try {
    return require(path);
  } catch (e) {
    console.error(`${path} model not found`);
    return null;
  }
};


//importe ta3hom
module.exports = {
  User: safeRequire('./User'),
  Gym: safeRequire('./Gym'),
  Product: safeRequire('./Product'),
  Order: safeRequire('./Order'),
  Post: safeRequire('./Post'),
  Workout: safeRequire('./Workout'),
};



  //bech nndir importe lkamel les models in blayes o5rin men application 
  //const { User, Gym, Product, Order, Post, Workout } = require('./models');