require("dotenv").config();

if (process.env.NODE_ENV == "test") console.log("test!", process.env.NODE_ENV);
else {
    console.log("not test!", process.env.NODE_ENV);
    return;
}

// Dependencies
const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../src/index");
const db = require("../src/db/db");

// Config
const port = process.env.PORT;
const should = chai.should();
const expect = chai.expect;
const Document = require("../src/db/Document");
chai.use(chaiHttp);

describe("General tests", () => {
    before((done) => {
        server.on("booted", function () {
            done();
        });
    });
    beforeEach((done) => {
        Document.remove({}, (err) => {
            done();
        });
    });
    
    /*
     * Test the default "/" route
     */
    describe("/GET route", () => {
        it("Testing the default route", (done) => {
            const data = { msg: `Index. DSN: ${db.getDSN()}`, status: "online" };
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    /* expect(res.body).to.have.property('status', "online"); */
                    done();
                });
        });
    });

    /*
     * Test the register function
     */
    /* describe("/POST register", () => {
        it("it should not POST a book without pages field", (done) => {
            let book = {
                title: "The Lord of the Rings",
                author: "J.R.R. Tolkien",
                year: 1954,
            };
            chai.request(server)
                .post("/book")
                .send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("errors");
                    res.body.errors.should.have.property("pages");
                    res.body.errors.pages.should.have.property("kind").eql("required");
                    done();
                });
        });
    }); */

});
