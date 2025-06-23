const http = require("http");
const fs = require("fs");
const path = require("path");
const fileName = path.join(__dirname, "db/todo.json");

const server = http.createServer((req, res) => {
  // res.end("Hello world");
  // get all todos
  if ((req.url === "/todos") & (req.method === "GET")) {
    fs.readFile(fileName, { encoding: "utf-8" }, (err, data) => {
      if (err) throw err;
      // console.log(data);

      res.writeHead(200, {
        message: "Fetched All todos",
        "content-type": "application/json",
        // "content-type": "text/html",
      });
      res.end(data);
    });
  }
  // create a todo
  else if ((req.url === "/todos/create-todo") & (req.method === "POST")) {
    // console.log(data);
    let totalChunks = "";
    req.on("data", (chunk) => {
      totalChunks += chunk;
      // console.log(chunk.toString());
    });
    req.on("end", () => {
      fs.readFile(fileName, { encoding: "utf-8" }, (err, data) => {
        if (err) throw err;
        const dbTodos = JSON.parse(data);
        const bodyData = JSON.parse(totalChunks);
        bodyData.createAt = new Date().toLocaleString();
        dbTodos.push(bodyData);
        fs.writeFile(fileName, JSON.stringify(dbTodos, null, 2), { encoding: "utf-8" }, (err) => {
          if (err) throw err;
        });
      });
      res.writeHead(200, {
        message: "Fetched All todos",
        "content-type": "application/json",
        // "content-type": "text/html",
      });
      res.end(totalChunks);
    });
  }
});

server.listen(5000, "127.0.0.1", () => {
  console.log("✅ Server listening to prot 5000");
});
