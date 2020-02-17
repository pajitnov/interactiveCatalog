import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { AppContainer } from 'react-hot-loader';
import Routes from './router';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './index.css';

ReactDOM.render(
	<AppContainer>
			<Routes />
	</AppContainer>,
  document.getElementById('root'));
  
serviceWorker.unregister();
