var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

//Check to make sure header is not undefined, if so, return Forbidden (403)
const checkToken = (req, res, next) => {
    const header = req.headers['x-access-token'];

    if (typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[0];
        req.token = token;
        next();
    } else {
        console.log("header undefined");
        //If header is undefined return Forbidden (403)
        res.sendStatus(403);
    }
};

//Protected route
router.post('/', checkToken, (req, res) => {
    //verify the JWT token generated for the user
    jwt.verify(req.token, secret, (err, authorizedData) => {
        if (err){
            //If error send Forbidden (403)
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
        } else { // success
            res.json({
                message: 'Successful log in',
                authorizedData
            });
            console.log('SUCCESS: Connected to protected route');
        }
    });
});

router.get('/week/1', function(req, res) {
    res.json({
        data: [
            {
                "question":"sdasyn på nodejs backend ramverk och berätta vilket ramverk du valde och varför.",
                "answer":"Jd"
            },
            {
                "question":"Berätta om din katalogstruktur och hur du organiserade din kod, hur tänkte du?",
                "answer":"Jag skapade en katalog med routes, som liknar det som kommer från scaffoldingen med express. Varje route fil exporterar en router."
            }
        ]
    });
});

router.get('/week/2', function(req, res) {
    res.json({
        data: [
            {
                "question":"kmom02d ramverk och berätta vilket ramverk du valde och varför.",
                "answer":"Jag valde expressjs som backend ramverk, då jag har stor tidigare erfarenhet med det ramverket och att det är det mest använda nodejs ramverket."
            },
            {
                "question":"Berätta om din katalogstruktur och hur du organiserade din kod, hur tänkte du?",
                "answer":"Jag skapade en katalog med routes, som liknar det som kommer från scaffoldingen med express. Varje route fil exporterar en router."
            }
        ]
    });
});

router.get('/week/3', function(req, res) {
    res.json({
        data: [
            {
                "question":"kmom03 ejs backend ramverk och berätta vilket ramverk du valde och varför.",
                "answer":"Jag valde expressjs som backend ramverk, då jag har stor tidigare erfarenhet med det ramverket och att det är det mest använda nodejs ramverket."
            },
            {
                "question":"Berätta om din katalogstruktur och hur du organiserade din kod, hur tänkte du?",
                "answer":"Jag skapade en katalog med routes, som liknar det som kommer från scaffoldingen med express. Varje route fil exporterar en router."
            }
        ]
    });
});

router.get('/week/4', function(req, res) {
    res.json({
        data: [
            {
                "question":"4 på nodejs backend ramverk och berätta vilket ramverk du valde och varför.",
                "answer":"Jag valde expressjs som backend ramverk, då jag har stor tidigare erfarenhet med det ramverket och att det är det mest använda nodejs ramverket."
            },
            {
                "question":"Berätta om din katalogstruktur och hur du organiserade din kod, hur tänkte du?",
                "answer":"Jag skapade en katalog med routes, som liknar det som kommer från scaffoldingen med express. Varje route fil exporterar en router."
            }
        ]
    });
});

router.get('/week/5', function(req, res) {
    res.json({
        data: [
            {
                "question":"5 på nodejs backend ramverk och berätta vilket ramverk du valde och varför.",
                "answer":"Jag valde expressjs som backend ramverk, då jag har stor tidigare erfarenhet med det ramverket och att det är det mest använda nodejs ramverket."
            },
            {
                "question":"Berätta om din katalogstruktur och hur du organiserade din kod, hur tänkte du?",
                "answer":"Jag skapade en katalog med routes, som liknar det som kommer från scaffoldingen med express. Varje route fil exporterar en router."
            }
        ]
    });
});

router.get('/week/6', function(req, res) {
    res.json({
        data: [
            {
                "question":"6 på nodejs backend ramverk och berätta vilket ramverk du valde och varför.",
                "answer":"Jag valde expressjs som backend ramverk, då jag har stor tidigare erfarenhet med det ramverket och att det är det mest använda nodejs ramverket."
            },
            {
                "question":"Berätta om din katalogstruktur och hur du organiserade din kod, hur tänkte du?",
                "answer":"Jag skapade en katalog med routes, som liknar det som kommer från scaffoldingen med express. Varje route fil exporterar en router."
            }
        ]
    });
});
router.get('/week/10', function(req, res) {
    res.json({
        data: [
            {
                "question":"10 på nodejs backend ramverk och berätta vilket ramverk du valde och varför.",
                "answer":"Jag valde expressjs som backend ramverk, då jag har stor tidigare erfarenhet med det ramverket och att det är det mest använda nodejs ramverket."
            },
            {
                "question":"Berätta om din katalogstruktur och hur du organiserade din kod, hur tänkte du?",
                "answer":"Jag skapade en katalog med routes, som liknar det som kommer från scaffoldingen med express. Varje route fil exporterar en router."
            }
        ]
    });
});

module.exports = router;
