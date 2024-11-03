const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

const middleware1 = (req, res, next) =>{
  console.log("from inside middleware " + req.headers.counter, "counter");
  res.send("Error from inside the middleware.");
  // next();
}

// app.use(middleware1);

const calculateSum = (counter) => {
  let sum = 0;
  for (let i = 1; i <= counter; i++) {
    sum = sum + i;
  }
  return sum;
};

const calculateMul = (counter) =>{
  let mul = 1;
  for(let i=1; i<= counter;i++){
    mul = mul * i;
  }
  return mul;
}

const handleFirstRequest = (req, res) => {
  console.log(req.body, "bodyData");
  // let counter = req.query.counter;
  let counter = req.body.counter;
  // let counter = req.headers.counter;
  // console.log(req.query, "query");
  let sum = calculateSum(counter);
  let multi = calculateMul(counter);
  let objectedSum = {
    sum,
    multi,
  }
  // const response = "The sum is " + result;
  res.status(200).send(objectedSum);
};

const createUser = (req, res) => {
  res.send("user created successfully");
};

const givePage = (req,res) =>{
  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello from HTML page</title>
</head>
<body>
    <b>Hi there!!!</b>
</body>
</html>
    `)
}

app.get("/", givePage);

// app.get("/handleSum", handleFirstRequest);
app.post("/handleSum", handleFirstRequest);

app.post("/createUser", createUser);

const started = () => {
  console.log(`Example app listening on port ${port}`);
};

app.listen(port, started);
