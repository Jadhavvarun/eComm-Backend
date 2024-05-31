require('dotenv').config();
var express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

//res in json format
app.use(express.json());

//enable cors
app.use(cors({
  origin: '*'
}));

app.get('/', function (req, res) {
  res.send('Hey, I am Node.JS');
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const loginRoute = require("./api/login/login.router")
const cartRoute = require("./api/cart/cart.route")

app.use("/api/login",loginRoute)
app.use("/api/cart",cartRoute)

app.listen(process.env.APP_PORT, function () {
  console.log('Example app listening on port 4000!');
});