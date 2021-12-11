// Environment vars
require("dotenv").config();

// Essential deps & config
const express = require("express");
const app = require("express")();
const httpServer = require("http").Server(app);
const port = process.env.PORT;
const cors = require("cors");
const io = require("socket.io")(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"], credentials: true },
});

const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");

// Misc dependencies
const chalk = require("chalk");

// User imports
const mw = require("./modules/middleware"); // Middleware functions
const db = require("./db/db"); // Database
const auth = require("./modules/auth"); // Handle authentication
require("./modules/socket")(io); // Handle sockets. io = socket server io.
const typeDefs = require("./graphql/typeDefs"); // GQL
const resolvers = require("./graphql/resolvers"); // GQL

// Server setup
app.use(express.json()); // parsing application/json
app.use(express.urlencoded({ extended: true })); // parsing application/x-www-form-urlencoded
app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE"], credentials: true })); // cors

// Env mode check
console.log("Launching API in env mode:", process.env.NODE_ENV);
let testing = false;
if (process.env.NODE_ENV == "test") testing = true;
if (!testing) app.use(mw.morganMW);

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

// Get docs for user, unlocked using credentials
app.get("/docs", mw.authToken, async (req, res) => {
    const username = req.user.username; // gets set by mw.authToken
    const docs = await db.listDocs(username);
    res.json(docs); // send docs back
});

// Creates doc for user, after auth
app.post("/create", mw.authToken, async (req, res) => {
    const username = req.user.username; // gets set by mw.authToken
    const allowedUsers = req.body.allowedUsers;
    let users = [username];
    if (allowedUsers) {
        users = users.concat(allowedUsers); // add other users
        users = [...new Set(users)]; // remove duplicates
        console.log("=> Creating doc with extra users:", users);
    }
    console.log("=> Creating doc for only user:", users);
    const document = await db.create(req.body.name, users);
    res.json(document); // send doc back
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
app.all("/ping", (req, res) => {
    res.send("API is running!")
})

/** ROUTES END **/

// ERROR HANDLING
app.use((_req, _res, next) => {
    var err = new Error("Not Found");
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
async function startServer(typeDefs, resolvers) {
    // BOOT TEXT
    let date = new Date();
    let bootText = [
        chalk.hex("#f78fb3").bold(`🌠 [${date.toISOString().slice(0, -5)}]`),
        chalk.hex("#ff4757").bold("DSN:"),
        chalk.hex("#34ace0").bold(db.getDSN()),
    ].join(" ");

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();
    server.applyMiddleware({ app });

    await db.connect();

    await new Promise((resolve) => httpServer.listen({ port }, resolve));
    console.log(`🚀 API launched at http://localhost:${port}${server.graphqlPath}`);
    if (!testing) console.log(bootText);
}

startServer(typeDefs, resolvers);
