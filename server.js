const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const db = require("./app/models");

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).
    then(() => {
        console.log("connected to dabase!")
  }).
    catch(err => {
        console.log("cant connect to database!", err);
  });

var corsOptions = {
    origin: "http://localhost:8080"
};

app.use(cors(corsOptions));

//parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the tutorial app" });
})

require("./app/routes/tutorial.routes")(app);


//set port and listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is runnong on port ${PORT}.`)
});