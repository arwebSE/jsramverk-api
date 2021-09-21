const express = require('express');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

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

module.exports = router;
