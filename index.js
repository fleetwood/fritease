const config = require('./comp/config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('express-hbs');
const http = require('http');
const path = require('path');
const api = require('./api');
const apiUI = require('./api.ui');
const utils = require('./comp/utils');
const app = express();
const cache = require('express-redis-cache')({
  prefix: 'fritease',
  expire: 1000*60*60*24
});
const twitter = require('./comp/twitter');
const moment = utils.moment;
const Scheduler = require('./comp/Scheduler');


app.use(function (req, res, next) {
    req.rawBody = '';
    req.on('data', (chunk) => req.rawBody += chunk);

    res.use_express_redis_cache = !(req.query.nocache || req.params.nocache);
    const clearCache = (req.query.clearcache || req.params.clearcache);
    if (clearCache) {
        cache.del('*', (err, num) => {
            if (err) {
                console.log(`ERROR deleting cache!\n${err.toJsonString()}`);
            }
            else if(num) {
                console.log(`Deleted cache (${num})`);
            }
        });
    }
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

// TODO: build an async call to get existing FF5 users as part of schedule
// so that User method doesn't have to make a db call every time. Will need
// to reference ff5_users as part of app

api.init(app);
apiUI.init(app, cache);

app.get('/', cache.route('index'), (req, res) => {
    res.render('index', {
      domain: req.get('host'),
      protocol: req.protocol,
      title: '#FriTease',
      layout: 'layouts/default'
    });
  })
  .get('/friTease', cache.route('friTease'), (req, res) => {
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

if (config.knex.debug === true) {
  cache.on('message', (message) => console.log(`REDIS : ${message}`));
}

new Scheduler();
const server = http.createServer(app);
server.listen(config.port, null, function () {
    console.log('Express webserver configured and listening at http://localhost:' + config.port);
});
