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
const Document = require("../src/db/Document");
//const User = require("../src/db/User");
chai.use(chaiHttp);

describe("General tests", () => {
    before((done) => {
        Document.deleteMany({}, () => done());
        app.on("booted", () => {
            //User.deleteMany({}, () => {});
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
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.data).to.have.property("status", "online");
                    done();
                });
        });
        it("Testing the ping route", (done) => {
            chai.request(app)
                .get("/ping")
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.text).to.be.a("string");
                    expect(res.text).to.equal("API is running!");
                    done();
                });
        });
        it("Testing 404 route", (done) => {
            chai.request(app)
                .get("/unknown")
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(404);
                    done();
                });
        });
        it("Testing graphql route fail", (done) => {
            chai.request(app)
                .get("/graphql")
                .end((err, res) => {
                    if (err) return done(err);
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
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    done();
                });
        });
        it("Testing /invite fail", (done) => {
            chai.request(app)
                .get("/invite")
                .query({})
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(500);
                    done();
                });
        });
        it("Testing /accept", (done) => {
            chai.request(app)
                .get("/accept")
                .query(data)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    done();
                });
        });
        it("Testing /accept fail", (done) => {
            chai.request(app)
                .get("/accept")
                .end((err, res) => {
                    if (err) return done(err);
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
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(403);
                    done();
                });
        });
        it("Testing /login fail 500", (done) => {
            chai.request(app)
                .post("/login")
                .send(data)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(500);
                    done();
                });
        });
        it("Testing /logout 204", (done) => {
            chai.request(app)
                .delete("/logout")
                .send(data)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(204);
                    done();
                });
        });
        it("Testing /register fail", (done) => {
            chai.request(app)
                .post("/register")
                .send(data)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(500);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property("message", "User already exist!");
                    done();
                });
        });
    });

    describe("GraphQL", () => {
        let data = {
            user: "test",
            docid: 1,
            name: "test",
            data: "test content",
        };
        it("Reset Documents function", (done) => {
            chai.request(app)
                .post("/graphql")
                .send({ query: "{ resetDocs { deletedCount } }" })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.data.resetDocs).to.have.property("deletedCount");
                    done();
                });
        });
        it("Test documents list query", (done) => {
            chai.request(app)
                .post("/graphql")
                .send({ query: `{ documents(user: "${data.user}") { name } }` })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.data.documents).to.deep.equal([]);
                    done();
                });
        });
        it("Test openDoc query", (done) => {
            chai.request(app)
                .post("/graphql")
                .send({ query: `{ openDoc(docid: "${data.docid}") { _id } }` })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.data.documents).to.be.undefined;
                    done();
                });
        });
        it("Test createDoc mutation", (done) => {
            chai.request(app)
                .post("/graphql")
                .send({ query: `mutation CreateDoc{ createDoc(name: "${data.name}") { _id name } }` })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.data.createDoc).to.have.property("_id");
                    expect(res.body.data.createDoc).to.have.property("name");
                    expect(res.body.data.createDoc._id).to.be.a("string");
                    expect(res.body.data.createDoc._id).to.have.length.above(1);
                    expect(res.body.data.createDoc.name).to.be.a("string");
                    expect(res.body.data.createDoc.name).to.equal(data.name);
                    done();
                    data.docid = res.body.data.createDoc._id; //save docid
                });
        });
        it("Test updateDoc mutation", (done) => {
            chai.request(app)
                .post("/graphql")
                .send({
                    query: `mutation UpdateDoc{ updateDoc(docid: "${data.docid}", data: "${data.data}") { _id data } }`,
                })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.data.updateDoc).to.have.property("_id");
                    expect(res.body.data.updateDoc).to.have.property("data");
                    expect(res.body.data.updateDoc._id).to.be.a("string");
                    expect(res.body.data.updateDoc._id).to.have.length.above(1);
                    expect(res.body.data.updateDoc._id).to.equal(data.docid);
                    expect(res.body.data.updateDoc.data).to.be.a("string");
                    expect(res.body.data.updateDoc.data).to.equal(data.data);
                    done();
                });
        });
        it("Test deleteDoc mutation", (done) => {
            chai.request(app)
                .post("/graphql")
                .send({
                    query: `mutation DeleteDoc{ deleteDoc(docid: "${data.docid}") }`,
                })
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    done();
                });
        });
    });
});
