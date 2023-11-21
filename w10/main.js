import express from "express";
const app = express();
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!existsSync(join(__dirname, "database.json"))) {
  writeFileSync(join(__dirname, "database.json"), "[]");
}

const database = JSON.parse(readFileSync(join(__dirname, "database.json"), { encoding: "utf-8" }));

app.use(express.json());
app.use(express.static(join(__dirname, "static")));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "view", "index.html"));
});

app.post("/api/create", (req, res) => {
  const data = req.body;

  if (!(data.title && data.title && data.author)) {
    res.sendStatus(400);
    return;
  }

  const post = {
    id        : createUniqueId(),
    title     : data.title,
    author    : data.author,
    content   : data.content,
    timestamp : Date.now(),
  };

  database.push(post);
  writeFileSync(join(__dirname, "database.json"), JSON.stringify(database));
  res.status(200).send(post);
});

app.get("/api/posts", (req, res) => {
  const posts = database.slice(req.query.skip ?? 0, req.query.limit ?? 10);
  res.send(posts);
});

app.get("/api/post/:id", (req, res) => {
  const post = database.find(v => v.id == req.params.id);

  if (!post) {
    res.sendStatus(404);
    return;
  }

  res.send(post);
});

app.delete("/api/post/:id", (req, res) => {
  const index = database.findIndex(v => v.id == req.params.id);

  if (index == -1) {
    res.sendStatus(404);
    return;
  }

  const post = database[index];
  database.splice(index, 1);
  writeFileSync(join(__dirname, "database.json"), JSON.stringify(database));

  res.send(post);
});

app.listen(3000, () => console.log("Listening on port 3000..."));

function createUniqueId() {
  const ids = database.map(v => v.id);

  while (true) {
    const generatedId = Math.random().toString(36).substring(2, 9);

    if (!ids.includes(generatedId)) {
      return generatedId;
    }
  }
}