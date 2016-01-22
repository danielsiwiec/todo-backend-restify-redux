import startServer from './src/server';
import makeStore from './src/store';

const store = makeStore();
startServer(store);
