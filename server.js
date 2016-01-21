import restify from 'restify';

const server = restify.createServer({
  name: 'todo'
});
server.use(restify.CORS());

server.get('/', (req, res, next) => {
  res.send('test');
  return next();
});

server.listen(8080, () => {
  console.log(`${server.name} listening at ${server.url}`);
});
