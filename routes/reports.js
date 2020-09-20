var express = require('express'),
    router = express.Router();

router.get('/week/1', function(req, res) {
    res.json({
        data: [
            {
                "question":"sdasyn på nodejs backend ramverk och berätta vilket ramverk du valde och varför.",
                "answer":"Jag valde expressjs som backend ramverk, då jag har stor tidigare erfarenhet med det ramverket och att det är det mest använda nodejs ramverket."
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
