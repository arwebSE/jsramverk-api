// Environment vars
require("dotenv").config();

// Essential deps & config
const express = require("express");
const app = require("express")();
const httpServer = require("http").Server(app);
const port = process.env.PORT;
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");

// Misc dependencies
const chalk = require("chalk");

// User imports
const mw = require("./modules/middleware"); // Middleware functions
const db = require("./db/db"); // Database
const auth = require("./modules/auth"); // Handle authentication
const typeDefs = require("./graphql/typeDefs"); // GQL
const resolvers = require("./graphql/resolvers"); // GQL
const email = require("./modules/email"); // SendGrid (email)

// Server setup
app.use(express.json()); // parsing application/json
app.use(express.urlencoded({ extended: true })); // parsing application/x-www-form-urlencoded
let corsOptions = {
    origin: [
        "https://studio.apollographql.com",
        "www.student.bth.se",
        "http://www.student.bth.se",
        "http://127.0.0.1",
        "http://localhost",
    ],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
};
app.use(cors(corsOptions)); // cors
const io = require("socket.io")(httpServer, { cors: corsOptions });
require("./modules/socket")(io); // Handle sockets. io = socket server io.

// Env mode check
console.log("Launching API in env mode:", process.env.NODE_ENV);
if (process.env.NODE_ENV !== "test") app.use(mw.morganMW);

/** ROUTES **/

// Index page (to check status of API)
app.get("/", function (_req, res) {
    res.json({
        data: { msg: `Index. DSN: ${db.getDSN()}`, status: "online" },
    });
});

// Refresh AccessToken using RefreshToken.
app.post("/token", async (req, res) => {
    const refreshToken = req.body.token;
    auth.getAccessToken(refreshToken, res);
});

// Login user using username and password.
app.post("/login", async (req, res) => {
    auth.login(req, res);
});

// Logout specified user
app.delete("/logout", async (req, res) => {
    auth.logout(req, res);
});

// Register user using new username and password
app.post("/register", async (req, res) => {
    auth.register(req, res);
});

// Ping route for uptimerobot
app.all("/ping", (_req, res) => {
    res.send("API is running!");
});

// Create invite to document
app.get("/invite", async (req, res) => {
    let data = {
        docid: req.query.docid,
        user: req.query.user,
        email: req.query.email,
    };
    console.log("Recieved invite!", data.docid, data.user, data.email);
    try {
        await email.send(req, res, data);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500).send(error);
    }
});

// Accept invite via link
app.get("/accept", async (req, res) => {
    await db.addDocumentEditor(req, res);
});

/** ROUTES END **/

// ERROR HANDLING
app.use((_req, _res, next) => {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    if (req.url == "/graphql") return next(); // ignore gql endpoint
    res.status(err.status || 500).json({
        errors: [{ status: err.status, title: err.message, detail: err.message }],
    });
});

// BOOTUP
const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

app.listen(async () => {
    // BOOT TEXT
    let date = new Date();
    let bootText = [
        chalk.hex("#f78fb3").bold(`🌠 [${date.toISOString().slice(0, -5)}]`),
        chalk.hex("#ff4757").bold("DSN:"),
        chalk.hex("#34ace0").bold(db.getDSN()),
    ].join(" ");

    await apollo.start();
    apollo.applyMiddleware({ app });

    await db.connect();

    const bootup = new Promise((resolve) => httpServer.listen({ port }, resolve));
    await bootup
        .then(console.log(`🚀 API launched at http://localhost:${port}${apollo.graphqlPath}`))
        .then(app.emit("booted"))
        .catch((err) => console.log("Error booting up!", err));
    console.log(bootText);
});

module.exports = { app, httpServer, apollo };
