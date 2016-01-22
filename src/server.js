import restify from 'restify';
import UrlDecorator from './UrlDecorator';

export default function startServer(store){
  const server = restify.createServer({
    name: 'todo'
  });
  server.use(restify.CORS());
  server.use(restify.bodyParser());

  const urlDecorator = new UrlDecorator(server.router);
  const decorateWithUrl = urlDecorator.decorate.bind(urlDecorator);

  server.get('/', (req, res, next) => {
    let todos = store.getState().get('todos').toList();
    res.json(todos.map(todo => decorateWithUrl(todo, req)));
    return next();
  });

  server.get({name: 'id', path: '/:id' }, (req, res, next) => {
    res.json(decorateWithUrl(findById(req.params.id), req));
    return next();
  });

  server.post('/', (req, res, next) => {
    store.dispatch({type: 'ADD', todo:req.body});
    res.json(decorateWithUrl(getLastTodo(), req));
    return next();
  });

  server.del('/', (req, res, next) => {
    store.dispatch({type: 'DELETE_ALL'});
    res.end();
    return next();
  });

  server.del('/:id', (req, res, next) => {
    store.dispatch({type: 'DELETE', id: req.params.id });
    res.end();
    return next();
  });

  server.patch('/:id', (req, res, next) => {
    store.dispatch({type: 'EDIT', id: req.params.id, patch: req.body});
    res.json(decorateWithUrl(findById(req.params.id), req));
    return next();
  });

  server.listen(process.env.PORT || 8080, () => {
    console.log(`${server.name} listening at ${server.url}`);
  });

  function findById(id) {
    return store.getState().get('todos').get(id);
  }

  function getLastTodo(){
    let currentId = store.getState().get('currentId');
    return store.getState().getIn(['todos', currentId]);
  }
}
