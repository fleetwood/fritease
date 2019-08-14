const lib = require('lib')({token: require('./config').LIB_TOKEN})
    , sms = lib.utils.sms['@1.0.11']
    , me = require('./config').ME;

const send = (message, to = me) => new Promise((resolve, reject) => {
   resolve(sms({
       to: null, // (required)
       body: null // (required)
    }));
});

module.exports = {
    send
}
