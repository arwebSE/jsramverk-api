require("dotenv").config()

const express = require("express");
const app = express();
const port = process.env.PORT;

const cors = require("cors");
app.use(cors());

const morgan = require("morgan");
const chalk = require("chalk");

const morganMiddleware = morgan(function(tokens, req, res) {
    return [
        chalk.hex("#ff4757").bold("🎃"),
        chalk.hex("#f78fb3").bold(`[${tokens.date(req, res, "iso").slice(0, -5)}]`),
        chalk.hex("#34ace0").bold(tokens.method(req, res)),
        chalk.hex("#ffb142").bold(tokens.status(req, res)),
        chalk.hex("#ff5252").bold(tokens.url(req, res)),
        chalk.yellow(tokens["remote-addr"](req, res)),
        chalk.hex("#2ed573").bold(tokens["response-time"](req, res) + " ms"),
    ].join(" ")
})
if (process.env.NODE_ENV !== "test") {
    app.use(morganMiddleware)
}

const db = require("./db/db");
const docs = require("./routes/docs");

/** Routes **/
app.get("/", function(_req, res) {
    res.json({
        data: { msg: `Index. DSN: ${db.getDSN()}` }
    });
});

app.use("/docs", docs);

// Add routes for 404 and error handling
app.use((_req, _res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});
app.use((err, _req, res, next) => {
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

let date = new Date();
bootText = [
    chalk.hex("#f78fb3").bold("🎃", date.toISOString().slice(0, -5)),
    chalk.hex("#ff4757").bold("DSN:"),
    chalk.hex("#34ace0").bold(db.getDSN()),
].join(" ")
app.listen(port, () => {
    console.log(`Running API on port ${port}!`);
    console.log(bootText);
}); // Start up server
