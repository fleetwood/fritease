const lib = require('lib')({token: require('./config').LIB_TOKEN})
    , sms = lib.utils.sms['@1.0.11']
    , me = require('./config').ME;

const send = (body, to = me) => new Promise((resolve, reject) => {
   resolve(sms({to, body}));
});

module.exports = {
    send
}
