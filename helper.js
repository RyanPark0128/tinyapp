const bcrypt = require('bcrypt');

const getUserByEmail = function(email, database) {
    for (const user in database) {
        if (database[user].email === email) {
            return database[user].id;
        }
    }
};

function urlsForUser(id, urlDatabase) {
    let urlsOfUser = {}
    for (const shortURL in urlDatabase) {
        if (urlDatabase[shortURL].userID === id) {
            urlsOfUser[shortURL] = urlDatabase[shortURL]
      }
    }
    return urlsOfUser
}

function longin(email, password, users) {
    for (const key in users) {
        if (email === users[key].email && bcrypt.compareSync(password, bcrypt.hashSync(users[key].password, 10)) === true) {
            return users[key]
        }
    }
    return null
}

function emailMatch(email) {
    for (const key in users) {
        if (email === users[key].email) {
            return true
        }
    }
    return false
}

function generateRandomString() {
    return Math.random().toString(36).replace('0.', '').slice(0, 6)
}


module.exports = { getUserByEmail, urlsForUser, longin, emailMatch, generateRandomString }

