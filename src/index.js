const express = require('express');

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());

const repositories = [];

function repositoryExist(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find((repo) => repo.id === id);

  if (!repository) {
    return response.status(404).json({ error: 'Repository not found' });
  }
  const index = repositories.findIndex((repo) => repo === repository);
  request.repository = repository;
  request.index = index;
  next();
}

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put('/repositories/:id', repositoryExist, (request, response) => {
  const { repository, index } = request;
  const updatedRepository = request.body;

  updatedRepository.likes = repository.likes;

  const repo = { ...repositories[index], ...updatedRepository };

  repositories[index] = repo;

  return response.json(repo);
});

app.delete('/repositories/:id', repositoryExist, (request, response) => {
  const { repository, index } = request;

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', repositoryExist, (request, response) => {
  const { index } = request;
  repositories[index].likes += 1;

  return response.json({ likes: repositories[index].likes });
});

module.exports = app;
