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
    let id = Number(req.params.id);
    res.json(store.getState().get('todos').get(id));
    next();
  });

  server.post('/', (req, res, next) => {
    store.dispatch({type: 'ADD', todo:req.body});
    let todo = store.getState().get('todos').last();
    res.send(urlDecorator.decorate(todo, req));
    return next();
  });

  server.del('/', (req, res, next) => {
    console.log('delete all');
    res.end();
    store.dispatch({type: 'DELETE_ALL', todo:req.body});
    return next();
  });

  server.listen(process.env.PORT || 8080, () => {
    console.log(`${server.name} listening at ${server.url}`);
  });

  function buildBaseUrl(req, todo) {
    let path = server.router.render('id', {id: todo.id});
    return `${req.isSecure() ? 'https' : 'http'}://${req.headers.host}${path}`;
  }
}
