var express = require('express');
var router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/users.sqlite');

function hashPass(user, pass) {
    bcrypt.hash(pass, 10, function(err, hash) {
        console.log("Hashing pw and storing user...");
        if (err) {
            console.log("Hashing error!", err);
        } else {
            db.run("INSERT INTO users (username, password) VALUES (?, ?)",
                user, hash, (err) => {
                    if (err) {
                        console.log("DB register error!", err);
                    } else {
                        console.log(`Registered user "${user}" in DB.`);
                    }
                });
        }
    });
}

router.post('/', (req, res) => {
    hashPass(req.body.username, req.body.password);
    res.json("we good!");
});

module.exports = router;
