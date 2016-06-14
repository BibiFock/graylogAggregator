import Debug from 'debug';
import App from '../../app';

var attachElement = document.getElementById('app');

var app;

Debug.enable('app*');

// Create new app and attach to element
app = new App({ state: null });

app.renderToDOM(attachElement);
