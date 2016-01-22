import restify from 'restify';
import UrlDecorator from './UrlDecorator';

export default function startServer(store){
  const server = restify.createServer({
    name: 'todo'
  });
  server.use(restify.CORS());
  server.use(restify.bodyParser());

  const urlDecorator = new UrlDecorator(server.router);

  server.get('/', (req, res, next) => {
    let todos = store.getState().get('todos').toList().toJS();
    res.json(todos.map(todo => urlDecorator.decorate(todo, req)));
    return next();
  });

  server.get({name: 'id', path: '/:id' }, (req, res, next) => {
    res.json(urlDecorator.decorate(findById(req.params.id), req));
    next();
  });

  server.post('/', (req, res, next) => {
    store.dispatch({type: 'ADD', todo:req.body});
    let todo = store.getState().get('todos').last();
    res.json(urlDecorator.decorate(todo, req));
    return next();
  });

  server.del('/', (req, res, next) => {
    store.dispatch({type: 'DELETE_ALL'});
    res.end();
    return next();
  });

  server.del('/:id', (req, res, next) => {
    store.dispatch({type: 'DELETE', id: Number(req.params.id) });
    res.end();
    return next();
  });

  server.patch('/:id', (req, res, next) => {
    store.dispatch({type: 'EDIT', id: Number(req.params.id), patch: req.body});
    res.json(urlDecorator.decorate(findById(req.params.id), req));
    return next();
  });

  server.listen(process.env.PORT || 8080, () => {
    console.log(`${server.name} listening at ${server.url}`);
  });

  function findById(id) {
    return store.getState().get('todos').get(Number(id));
  }
}
