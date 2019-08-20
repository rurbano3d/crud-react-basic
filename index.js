const express = require('express');

const server = express();

server.use(express.json());

let numRequests = 0;
//Middleware GLOBAL
function logRequests(req, res, next) {
  numRequests++;

  console.log(`Número de requisições: ${numRequests}`);

  return next();
}

server.use(logRequests); //chamada para a função global

//Função middleware para verificação se o ID existe, MIDDLEWARE LOCAL
function checkIdExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not exists!' });
  }

  return next();
}

//Constante que vai armazenar os dados, um array vazio
const projects = [];

//Listar todos os projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//lista somente um projeto
server.get('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;

  const index = projects.find(p => p.id == id); // função find que verifica WHERE id = id do parâmetro

  return res.json(index);
});

//Cadastra o projeto
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    //estrutra do projeto
    id,
    title,
    tasks: []
  };

  projects.push(project); // adiciona os dados novos no array projects

  return res.json(projects);
});

//Edita o projeto
server.put('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;

  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(projects);
});

//deleta o projeto
server.delete('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;

  const index = projects.find(p => p.id == id);

  projects.splice(index, 1);

  return res.json({ message: 'Deletado com sucesso!' });
});

//adiciona task ao projeto ja criado
server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
