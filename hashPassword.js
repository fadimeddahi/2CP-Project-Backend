const bcrypt = require('bcrypt');

const password = "password123"; // Remplacez par le mot de passe souhaité
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Mot de passe hashé :", hash);
  }
});




