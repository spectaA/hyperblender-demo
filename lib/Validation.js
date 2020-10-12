const bcrypt = require('bcrypt');

module.exports.email = function(email, callback) {
    // callback(emailVal, email)
    let regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
    if(regex.test(email) && email.length <= 255) callback(true, email)
    else callback(false, "email incorrecte");
}

module.exports.name = function(name, callback) {
    // callback(nameVal, name)
    if(name.length <= config.USERNAME_MAX_LENGTH && name.length > 0) callback(true, name)
    else callback(false, "nom d'utilisateur incorrect");
}

module.exports.password = function(p1, p2, callback) {
    // callback(passwordVal, hash)
    if(p1 != p2) {
        callback(false, "mots de passe différents");
    } else if(p1.length < config.USERPASSWORD_MIN_LENGTH) {
        callback(false, `votre mot de passe doit faire minimum ${config.USERPASSWORD_MIN_LENGTH} caractères`)
    } else {
        bcrypt.hash(p1, config.USERPASSWORD_SALT_ROUNDS, function (err, hash) {
            if (err) callback(false, "erreur de hachage du mot de passe")
            else callback(true, hash);
        })
    }
}
