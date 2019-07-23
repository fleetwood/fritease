const config = require('./comp/config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('express-hbs');
const http = require('http');
const path = require('path');
const api = require('./api');
const utils = require('./comp/utils');
const app = express();
const twitter = require('./comp/twitter');
const moment = utils.moment;

app.use(function (req, res, next) {
    req.rawBody = '';
    req.on('data', (chunk) => req.rawBody += chunk);
    next();
});

app.use(favicon(path.join(__dirname, './', 'favicon.ico')))
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set up handlebars ready for tabs
app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views/');
app.use(express.static('public/'));

hbs.registerHelper('ifeq', function (a, b, options) {
  if (a == b) { return options.fn(this); }
  return options.inverse(this);
});

hbs.registerHelper('gt', function (a, b, options) {
  if (a >= b) { return options.fn(this); }
  return options.inverse(this);
});

api.init(app);

app.get('/', (req, res) => {
    res.render('index', {
      domain: req.get('host'),
      protocol: req.protocol,
      title: '#FriTease',
      layout: 'layouts/default'
    });
  })
  .get('/friTease',(req,res) => {
    res.render('friTease', {
          title:'Recent streams',
          layout: 'layouts/default'
        });
  })
  .get('/icons',(req,res) => {
    utils.getFile(path.join(__dirname,'/comp/mocks/icons.json'))
        .then(icons => {
          utils.getFile(path.join(__dirname,'/comp/mocks/twitter_light.css.json'))
            .then(css => {
              icons = icons.toJson();
              let style =
              `background: #[CURRENT];
              background: -moz-linear-gradient(-45deg,  #[CURRENT] 0%, #[CURRENT] 50%, #[REPLACE] 51%, #[REPLACE] 100%);
              background: -webkit-linear-gradient(-45deg,  #[CURRENT] 0%,#[CURRENT] 50%,#[REPLACE] 51%,#[REPLACE] 100%);
              background: linear-gradient(135deg,  #[CURRENT] 0%,#[CURRENT] 50%,#[REPLACE] 51%,#[REPLACE] 100%);
              filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#[CURRENT]', endColorstr='#[REPLACE]',GradientType=1 );`
              let styles = JSON.parse(css).map(c => {
                return {
                    style: style.replaceAll('[CURRENT]', c.current).replaceAll('[REPLACE]', c.replace)
                    ,... c
                };
              });
              res.render('icons', {
                title:'Recent streams',
                layout: 'layouts/icons',
                icons: icons,
                styles
              });
          })
        })
        .catch(e => reject(e));
  });

const server = http.createServer(app);
server.listen(config.port, null, function () {
    console.log('Express webserver configured and listening at http://localhost:' + config.port);
});
