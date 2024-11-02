const express = require("express");
const app = express();
const port = 3000;

const calculateSum = (counter) => {
  let sum = 0;
  for (let i = 0; i <= counter; i++) {
    sum = sum + i;
  }
  return sum;
};

const handleFirstRequest = (req, res) => {
    let counter = req.query.counter;
    console.log(req.query,"query");
  let result = calculateSum(counter);

  res.send(result + " hello wordl");
};

const createUser = (req, res) =>{
    console.log("hello user");
    res.send("user created successfully");
}

app.get("/handleSum", handleFirstRequest);
app.post("/createUser", createUser);

const started = () => {
  console.log(`Example app listening on port ${port}`);
};

app.listen(port, started);
