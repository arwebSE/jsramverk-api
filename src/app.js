require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT;
const morgan = require('morgan');
const cors = require('cors');

const DB_HOST = process.env.DB_HOST
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const dsn = `mongodb+srv://${DB_USER}:<PASSWD>@${DB_HOST}/${DB_NAME}`;
if (process.env.NODE_ENV == "test") {
    dsn = "mongodb://localhost:27017/test";
}

const docs = require('./routes/docs');

app.use(cors());
// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

/** Routes **/
app.use('/docs', docs);

app.get('/', function(req, res) {
    res.json({
        data: {
            msg: `Index. DSN host: ${DB_HOST}`
        }
    });
});

// Add routes for 404 and error handling
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    if (res.headersSent) { return next(err); }
    res.status(err.status || 500).json({
        "errors": [{
            "status": err.status,
            "title": err.message,
            "detail": err.message
        }]
    });
});

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.listen(port, () => {
    console.log(`Running API on port ${port}!`);
    console.log(`DSN: ${dsn}.`);
}); // Start up server
