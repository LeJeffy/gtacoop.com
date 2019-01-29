// packages and required files:
const mustache = require('mustache-express');
const express = require('express');
const serverManager = require('./servermanager.js');
const downloadsItems = require('./elements/downloads.json');

// menu items:
const menuItems = [
	{name: 'Home', url: '/'},
	{name: 'Downloads', url: '/downloads'},
	{name: 'Servers', url: '/servers'},
	{name: 'Wiki', url: 'https://wiki.gtacoop.com'},
	{name: 'GitLab', url: 'https://gitlab.com/cgmp/gta'},
	{name: 'Discord', url: 'https://discord.gg/E6Tty42'}
]

// collect server info:
serverManager.start();

// express settings:
const app = express();
app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use('/', express.static('elements'));

// home page:
app.get('/', (req, res) => {
	res.status(200).render('index', { 
		items: menuItems
	});
});

// downloads page:
app.get('/downloads', (req, res) => {
	res.status(200).render('downloads', { 
		items: menuItems,
		downloads: downloadsItems
	});
});

// servers page:
app.get('/servers', (req, res) => {
	res.status(200).render('servers', {
		items: menuItems,
		servers: serverManager.servers, 
		online: serverManager.servers.reduce((a, b) => +a + +b.playerCount, 0), 
		serverCount: serverManager.servers.length
	});
});

// 404 page:
app.use(function (req, res, next) {
	res.status(404).render('404', {
		items: menuItems,
		error: 'This page doesn\'t exist or is removed'
	});
});

// 500 page:
app.use(function(err, req, res, next) {
	res.status(500).render('500', {
		items: menuItems,
		error: err.stack.split('\n').shift()
	});
});

// start app:
app.listen(8081);
