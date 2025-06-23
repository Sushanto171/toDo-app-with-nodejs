const http = require("http");
const fs = require("fs");
const path = require("path");
const fileName = path.join(__dirname, "db/todo.json");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathName = url.pathname;
  // get all todos
  if ((pathName === "/todos") & (req.method === "GET")) {
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
  else if ((pathName === "/todos/create-todo") & (req.method === "POST")) {
    let totalChunks = "";
    req.on("data", (chunk) => {
      totalChunks += chunk;
    });
    req.on("end", () => {
      fs.readFile(fileName, { encoding: "utf-8" }, (err, data) => {
        if (err) throw err;
        const bodyData = JSON.parse(totalChunks);
        const createdAt = new Date().toLocaleString();
        bodyData.createdAt = createdAt;
        const dbTodos = JSON.parse(data);
        dbTodos.push(bodyData);
        fs.writeFile(
          fileName,
          JSON.stringify(dbTodos, null, 2),
          { encoding: "utf-8" },
          (err) => {
            if (err) throw err;
          }
        );
        res.writeHead(200, {
          message: "Fetched All todos",
          "content-type": "application/json",
          // "content-type": "text/html",
        });
        res.end(JSON.stringify(bodyData));
      });
    });
  }
  //get  a todo
  else if ((pathName === "/todo") & (req.method === "GET")) {
    const param = url.searchParams.get("title");
    // console.log(param);

    fs.readFile(fileName, { encoding: "utf-8" }, (err, data) => {
      if (err) throw err;

      const allTodos = JSON.parse(data);
      const queryTodo = allTodos.filter((todo) => todo.title === param);

      // console.log(queryTodo);
      res.end(JSON.stringify(queryTodo));
    });
  } else {
    res.end("Route Not Found");
  }
});

server.listen(5000, "127.0.0.1", () => {
  console.log("✅ Server listening to prot 5000");
});
