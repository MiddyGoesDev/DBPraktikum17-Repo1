import { applyMiddleware, combineReducers } from 'redux';

import { createStoreWithBaqend, baqendReducer } from 'redux-baqend';
//import { createStoreWithBaqend, baqendReducer } from '../lib/redux-baqend/lib';
import middlewares from '../middleware';
import reducers from '../reducers';

//import { db } from 'baqend/lib/baqend/realtime'; 
import { db } from 'baqend/realtime';

export default (initialState = {}) => {
  const reducer = combineReducers({ baqend: baqendReducer, ...reducers });
  const middleware = applyMiddleware(...middlewares);

  return createStoreWithBaqend(db.connect('black-water-73', true), reducer, initialState, middleware);
}
