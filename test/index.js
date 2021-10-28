require("dotenv").config()

if (process.env.NODE_ENV == "test") {
    console.log("test!", process.env.NODE_ENV);
} else {
    console.log("not test!", process.env.NODE_ENV);
}

const index = require("../src/index");

const express = require("express");
const app = express();


app.use(express.urlencoded({ extended: false }));
app.use("/", index);



/* describe('BookRoute', function() {
    request(app)
        .get('/api/books')
        .expect('Content-Type', /json/)
        .expect('Content-Length', '4')
        .expect(200, "ok")
        .end(function(err, res){
           if (err) throw err;
        });
}); */

/* test("index route works", done => {
    request(app)
        .get("/")
        .expect("Content-Type", /json/)
        .expect({ status: "online" })
        .expect(200, done);
});
 */
