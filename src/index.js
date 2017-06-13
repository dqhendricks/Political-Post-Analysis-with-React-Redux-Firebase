import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom'; // allows url routing
import promise from 'redux-promise'; // middleware waits for ajax response
import thunk from 'redux-thunk'; // allow async action creators (return functions in action creator)

import reducers from './reducers';
import PageIndex from './components/page-index';

const createStoreWithMiddleware = applyMiddleware( promise, thunk )( createStore );

ReactDOM.render(
	<Provider store={ createStoreWithMiddleware( reducers ) }>
    	<BrowserRouter>
			<Switch>
				<Route path="/" component={ PageIndex } />
			</Switch>
		</BrowserRouter>
	</Provider>
	, document.querySelector( '.container' )
);
