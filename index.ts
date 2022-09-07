const express = require("express");
const app = express();
const port = 3000;
const HTTPCallLimiter = require("./HTTPCallLimiter");

const limiter = new HTTPCallLimiter(5);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/limit", limiter.middleware, function (req, res) {
  res.status(200).json({});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
