require("dotenv").config();

if (process.env.NODE_ENV === "test") console.log("Test mode ON!");
else {
    console.log("Test mode OFF. Abort tests.");
    return;
}

// Dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const { app, httpServer, apollo } = require("../src/index");
const db = require("../src/db/db");

// Config
//const should = chai.should();
const expect = chai.expect;
//const Document = require("../src/db/Document");
//const User = require("../src/db/User");
chai.use(chaiHttp);

describe("General tests", () => {
    before((done) => {
        app.on("booted", () => {
            //Document.deleteMany({}, () => {});
            //User.deleteMany({}, () => {});
            done();
        });
    });
    after("Stop server", (done) => {
        apollo.stop().then(() => {
            httpServer.close((err) => {
                db.getMongo().disconnect(() => {
                    console.log("Server Stopped! ⏹");
                    done();
                    //process.exit(err ? 1 : 0);
                });
            });
        });
    });

    /*
     * Test the "default" routes
     */
    describe("/GET test routes", () => {
        it("Testing the default route", (done) => {
            chai.request(app)
                .get("/")
                .end((_err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.data).to.have.property("status", "online");
                    done();
                });
        });
        it("Testing the ping route", (done) => {
            chai.request(app)
                .get("/ping")
                .end((_err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.be.a("string");
                    expect(res.text).to.equal("API is running!");
                    done();
                });
        });
        it("Testing 404 route", (done) => {
            chai.request(app)
                .get("/unknown")
                .end((_err, res) => {
                    expect(res).to.have.status(404);
                    done();
                });
        });
        it("Testing graphql route fail", (done) => {
            chai.request(app)
                .get("/graphql")
                .end((_err, res) => {
                    expect(res).to.have.status(400);
                    done();
                });
        });
    });

    /*
     * Test the email invite functions
     */
    describe("/GET mail invites", () => {
        const data = {
            docid: 1,
            user: "test",
            email: "test@test.com",
        };
        it("Testing /invite", (done) => {
            chai.request(app)
                .get("/invite")
                .query(data)
                .end((_err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
        it("Testing /invite fail", (done) => {
            chai.request(app)
                .get("/invite")
                .query({})
                .end((_err, res) => {
                    expect(res).to.have.status(500);
                    done();
                });
        });
        it("Testing /accept", (done) => {
            chai.request(app)
                .get("/accept")
                .query(data)
                .end((_err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
        it("Testing /accept fail", (done) => {
            chai.request(app)
                .get("/accept")
                .end((_err, res) => {
                    expect(res).to.have.status(500);
                    done();
                });
        });
    });

    /*
     * Test the AUTH routes
     */
    describe("Testing AUTH routes", () => {
        const data = {
            token: 1,
            username: "texxxxt",
        };
        it("Testing /token fail", (done) => {
            chai.request(app)
                .post("/token")
                .send(data)
                .end((_err, res) => {
                    expect(res).to.have.status(403);
                    done();
                });
        });
        it("Testing /login fail 500", (done) => {
            chai.request(app)
                .post("/login")
                .send(data)
                .end((_err, res) => {
                    expect(res).to.have.status(500);
                    done();
                });
        });
        it("Testing /logout 204", (done) => {
            chai.request(app)
                .delete("/logout")
                .send(data)
                .end((_err, res) => {
                    expect(res).to.have.status(204);
                    done();
                });
        });
        it("Testing /register fail", (done) => {
            chai.request(app)
                .post("/register")
                .send(data)
                .end((_err, res) => {
                    expect(res).to.have.status(500);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property("message", "User already exist!");
                    done();
                });
        });
    });
});
