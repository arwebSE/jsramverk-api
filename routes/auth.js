var express = require('express'),
    router = express.Router();

/*
exports.get = function(req, res){
    res.json({
        data: {
            msg: "Got a GET request, sending back default 200"
        }
    });
};

exports.login = function(req, res) {
    res.status(201).json({
        data: {
            msg: "Got a POST request, sending back 201 asdsa"
        }
    });
};

exports.put = function(req, res) {
    res.status(204).send();
};

exports.delete = function(req, res) {
    res.status(204).send();
}; */


/* const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./db/texts.sqlite');
const saltRounds = 10;
const plaintextPass = 'longa$$pass123'; */

/* bcrypt.hash(plaintextPass, saltRounds, function(err, hash) {
    // spara lösenord i databasen.
});

db.run("INSERT INTO users (email, password) VALUES (?, ?)",
    "user@example.com",
    "superlonghashedpasswordthatwewillseehowtohashinthenextsection", (err) => {
    if (err) {
        console.log("error db!", err);
    }
    console.log("correct db return");
}); */

/*
app.post('/register', (req, res) => {
    const userID = fn.createUserID(10);

   hashAndSetPassword(userID, req.body.password).then((hash) => {
        req.body.password = hash.data;
        registerUser(req.body, userID);
    }).catch((e)=>{
        console.log(e);
    });
}); */

module.exports = router;
