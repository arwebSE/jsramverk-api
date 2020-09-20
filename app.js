const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
const port = 1337;

const auth = require('./routes/auth');
const index = require('./routes/index');
const reports = require('./routes/reports');

app.use(cors());
// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// Routes
app.use('/auth', auth);
app.use('/', index);
app.use('/reports',  reports);

// Add routes for 404 and error handling
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.listen(port, () => console.log(`Running API on port ${port}!`)); // Start up server
