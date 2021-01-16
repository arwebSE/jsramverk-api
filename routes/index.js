var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.json({
        data: {
            msg: "hello! this is site index page"
        }
    });
});
router.get('/login', function(req, res) {
    res.json({
        data: {
            msg: "hello! this is login page"
        }
    });
});

router.get('/register', function(req, res) {
    res.json({
        data: {
            msg: "hello! this is register page"
        }
    });
});

// DEBUG
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/users.sqlite');
function getUsers() {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            console.log("error!", err);
        }
        console.log("users:", rows);
    });
    return;
}
router.get('/debug', function(req, res) {
    getUsers();
    res.json({
        data: {
            msg: "check console"
        }
    });
});

module.exports = router;
