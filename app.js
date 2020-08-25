const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();
const port = 1337;

const index = require('./routes/index');
const hello = require('./routes/hello');

app.use(cors());

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('dev')); // 'combined' outputs the Apache style LOGs
}

app.use('/', index);
app.use('/hello', hello);

// Testing routes with method
app.get("/user", (req, res) => {
    res.json({
        data: {
            msg: "Got a GET request"
        }
    });
});

// Testing routes with method
app.get("/user", (req, res) => {
    res.json({
        data: {
            msg: "Got a GET request, sending back default 200"
        }
    });
});

app.post("/user", (req, res) => {
    res.status(201).json({
        data: {
            msg: "Got a POST request, sending back 201 Created"
        }
    });
});

app.put("/user", (req, res) => {
    // PUT requests should return 204 No Content
    res.status(204).send();
});

app.delete("/user", (req, res) => {
    // DELETE requests should return 204 No Content
    res.status(204).send();
});

// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
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
// Start up server
app.listen(port, () => console.log(`Running API on port ${port}!`));
