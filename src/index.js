const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

let repositories = [
  {
    id: "1f08be12-3fa4-4c30-b387-c25ad5c3e610",
    title: "corrigindo-codigo-nodejs",
    url: "https://github.com/Jordaobm/corrigindo-codigo-nodejs",
    techs: ["nodejs", "javascript"],
    likes: 0
  }
];

function checkExistRepository(request, response, next) {
  const { id } = request.params;

  const repository = repositories?.find((e) => e?.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repositório não encontrado" });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories?.push(repository);

  return response?.status(201).json(repository);
});

app.put("/repositories/:id", checkExistRepository, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  let editRepository = {};

  repositories = repositories?.map((repository) => {
    if (repository?.id === id) {
      editRepository = { ...repository, title, url, techs };

      return editRepository;
    }

    return repository;
  });

  return response.status(200)?.json(editRepository);
});

app.delete("/repositories/:id", checkExistRepository, (request, response) => {
  const { id } = request.params;

  repositories = repositories?.filter((e) => e?.id !== id);

  return response.status(204).send();
});

app.post(
  "/repositories/:id/like",
  checkExistRepository,
  (request, response) => {
    const { id } = request.params;

    let likeCount = 0;

    repositories = repositories?.map((e) => {
      if (e?.id === id) {
        likeCount = e?.likes + 1;
        return { ...e, likes: likeCount };
      }

      return e;
    });

    return response?.status(200)?.json({ likes: likeCount });
  }
);

module.exports = app;
