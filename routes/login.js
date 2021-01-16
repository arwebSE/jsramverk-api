var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/users.sqlite');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET; /* dKVTbfu4IhtNq0LpE1iHglsOxnrYZ5AW */

router.post('/', (req, result) => {
    const user = req.body.username;
    const pass = req.body.password;
    let sql = "SELECT * FROM users WHERE username = ?";
    console.log("Recieved login: User:", user, "Pass:", pass);

    db.get(sql, user, (err, row) => {
        if (err) { console.log(err); }
        //check db for details
        if (user === row.username) {
            //if username match
            bcrypt.compare(pass, row.password).then((res) => {
                //check password
                if (res) {
                    jwt.sign({ user: user }, secret, { expiresIn: '1h' }, (err, token) => {
                        //send login token
                        if (err) { console.log(err); }
                        else {
                            console.log("Logged in! User:", user);
                            return result.json(token);
                        }
                    });
                } else { console.log("Wrong password!"); }
            });
        }
    });
});

module.exports = router;
