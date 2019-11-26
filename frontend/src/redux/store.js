import { applyMiddleware, createStore, compose, combineReducers } from 'redux';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { adminReducer, adminSaga, USER_LOGOUT } from 'react-admin';
import logger from 'redux-logger';
import rootReducer from './reducers';

export default ({ initialState, authProvider, dataProvider, history }) => {
  const reducer = combineReducers({
    admin: adminReducer,
    router: connectRouter(history),
    rootReducer,
  });
  const resettableAppReducer = (state, action) => reducer(action.type !== USER_LOGOUT ? state : undefined, action);

  const saga = function* rootSaga() {
    yield all(
      [
        adminSaga(dataProvider, authProvider),
        // add your own sagas here
      ].map(fork),
    );
  };
  const sagaMiddleware = createSagaMiddleware();

  const composeEnhancers =
    (process.env.NODE_ENV === 'development' &&
      typeof window !== 'undefined' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 25,
      })) ||
    compose;

  const store = createStore(
    resettableAppReducer,
    initialState,
    composeEnhancers(
      applyMiddleware(sagaMiddleware, routerMiddleware(history)),
      // add your own enhancers here
    ),
  );
  sagaMiddleware.run(saga);
  return store;
};

// export default function(initialState, browserHistory) {
//   const routermw = routerMiddleware(browserHistory);

//   const store = createStore(
//     rootReducer,
//     initialState,
//     compose(
//       applyMiddleware(routermw),
//       applyMiddleware(logger),
//       window.devToolsExtension(),
//     ),
//   );

//   if (module.hot) {
//     // Enable Webpack hot module replacement for reducers
//     module.hot.accept('./reducers', () => {
//       store.replaceReducer(require('./reducers'));
//     });
//   }

//   return store;
// }
