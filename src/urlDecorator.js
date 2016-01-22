class UrlDecorator{
  constructor(router){
    this.router = router;
  }

  decorate(todo, req){
    let path = this.router.render('id', {id: todo.id});
    let url = `${req.isSecure() ? 'https' : 'http'}://${req.headers.host}${path}`;
    return Object.assign({url: url}, todo);
  }
}

export default function decoratorFactory(router){
  let decorator = new UrlDecorator(router);
  return decorator.decorate.bind(decorator);
}
