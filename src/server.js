import restify from 'restify';
import urlDecorator from './urlDecorator';
import {findById, getLast} from './storeHelper';

export default function startServer(store){
  const server = restify.createServer();
  server.use(restify.CORS());
  server.use(restify.bodyParser());

  const decorateWithUrl = urlDecorator(server.router);

  server.get('/', (req, res, next) => {
    let todos = store.getState().get('todos').toList();
    res.json(todos.map(todo => decorateWithUrl(todo, req)));
    return next();
  });

  server.get({name: 'id', path: '/:id' }, (req, res, next) => {
    res.json(decorateWithUrl(findById(req.params.id, store), req));
    return next();
  });

  server.post('/', (req, res, next) => {
    store.dispatch({type: 'ADD', todo:req.body});
    res.json(decorateWithUrl(getLast(store), req));
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
    res.json(decorateWithUrl(findById(req.params.id, store), req));
    return next();
  });

  server.listen(process.env.PORT || 8080, () => {
    console.log(`Server started at ${process.env.PORT || 8080}`);
  });

}
