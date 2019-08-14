/////////////////////////////
// REQUIRES
const config = require('./config');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const sqlString = require('sqlstring');

/////////////////////////////
// PROTOTYPING
const isUndefined = (type) => {
    return (typeof type === 'undefined');
}

if (isUndefined(Number.twitterFormat)) {
    Object.defineProperty(Number.prototype, 'twitterFormat', {
        value() {
            if(this>=1000000) {
                return (this/1000000).toFixed(1)+'M'
            }
            else if(this>=5000) {
                return (this/1000).toFixed(1)+'K'
            }
            else {
                return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }
    });
}

if (isUndefined(String.escapeRegExp)) {
    Object.defineProperty(String.prototype, 'escapeRegExp', {
        value() {
            return this.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        }
    });
}

if (isUndefined(String.replaceAll)) {
    Object.defineProperty(String.prototype, 'replaceAll', {
        value(pattern, token) {
            return this.replace(new RegExp(pattern.escapeRegExp(), 'g'), token);
        }
    });
}

if (isUndefined(String.toJson)) {
    Object.defineProperty(String.prototype, 'toJson', {
        value() {
            try {
                return JSON.parse(this);
            }
            catch (e) {
                log(e);
                return {};
            }
        }
    });
}

if (isUndefined(String.toHtmlBr)) {
    /**
     * Replaces '\r\n', '\r', '\n' with <br/>
     */
    Object.defineProperty(String.prototype, 'toHtmlBr', {
        value() {
            return this
                .replaceAll('\r\n', '<br />')
                .replaceAll('\r', '<br />')
                .replaceAll('\n', '<br />');
        }
    });
}

if (isUndefined(Object.toJsonString)) {
    Object.defineProperty(Object.prototype, 'toJsonString', {
        value() {
            return JSON.stringify(this, null, 2);
        }
    });
}

if (isUndefined(Array.sortBy)) {
    /**
     * @param {String} property
     * @param {String} dir
     * @returns {Array}
     * 
     * @description Sorts the array by the property. Default ascending, unless set to DESC
     */
    Object.defineProperty(Array.prototype, 'sortBy', {
        value(property, dir) {
            return dir && (dir.toUpperCase() === 'DESC' || dir.toUpperCase() === 'DSC' || dir.toUpperCase() === 'DES')
                ? this.sort((a, b) => (a[property] > b[property] ? 1 : -1))
                : this.sort((a, b) => (a[property] < b[property] ? 1 : -1));
        }
    })
}

if (isUndefined(Array.dedupe)) {
    Object.defineProperty(Array.prototype, 'dedupe', {
        value(prop) {
            const removeDuplicates = (myArr, prop) => {
                return myArr.filter((obj, pos, arr) => {
                    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
                });
            };
            return removeDuplicates(this, prop);
        }
    })
}

if (isUndefined(Array.limit)) {
    /**
     * @param {Number} threshold Number of items to return
     * @param {String} sort Sort property (Optional)
     * @param {String} dir Sort direction (Optional)
     * @see {Array.sortBy}
     */
    Object.defineProperty(Array.prototype, 'limit', {
        value(threshold, sort = null, dir = null) {
            let results = [];
            let arr = sort ? this.sortBy(sort,dir) : this;
            while(threshold>0) {
                results.push(arr[threshold-1]);
                threshold--;
            }
            return results;
        }
    })
}

if(isUndefined(fs.readFileAsync)) {
    // make Promise version of fs.readFile()
    fs.readFileAsync = function (filename, enc = 'utf8') {
        return new Promise(function (resolve, reject) {
            fs.readFile(filename, enc, function (err, data) {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    };
}

if(isUndefined(fs.writeFileAsync)) {
    // make Promise version of fs.readFile()
    fs.writeFileAsync = function (filename, data, enc = 'utf8') {
        return new Promise(function (resolve, reject) {
            try {
                fs.writeFileSync(filename, data, {encoding:enc,flag:'w'});
                resolve(filename);
            }
            catch(error) {
                reject(error);
            }
        });
    };
}
/////////////////////////////
// METHODS

/**
 * @param {Number} x
 * @param {Number} y
 * @description y must be greater than x
 */
const rand = (x = 0, y = 9) => {
    return Math.floor(Math.random() * (y - x) + x);
};

/**
 * 
 * @param {Number} num Number to check
 * @param {Boolean} pos Force a positive integer return (_Default: true_)
 * @returns {Num} Original number, or 0 if _pos_ is true, -1 if false
 * @description Safely return an integer from a non-number value.
 */
const asNum = (num, pos = true) => {
    if (isNaN(num)) {
        return pos ? 0 : -1
    }
    return pos && num < 0 ? num * -1 : num;
}

/**
 * 
 * @param {String} str Safely check for null or undefined strings
 * @returns {String} Original string or null
 */
const stringOrNull = (str) => {
    return str.length ? str.toString() : null;
}

/**
 * 
 * @param {String} filename Absolute path to file
 * @returns {Promise}
 */
const getFile = (filename) => {
    return fs.readFileAsync(filename, 'utf8');
}

/**
 * @param {String} salt
 * @param {Boolean} lower default:true
 * @description Salt provides format using provided separator. Lowers defaults to true.
 */
const guid = (salt = 'XXXXXX-99999-XXXXXX', lower = true) => {
    let sep = salt.match(/[^0-9a-zA-Z\d\s:]/);
    sep = sep && sep[0] ? sep[0] : '-';
    const vals = salt.split(sep)
        , alpha = (lower ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ').split('')
        , pad = (val, len) => {
            let res = val.toString();
            while (res.length < len) {
                res = `0${res}`;
            }
            return res;
        };
    return vals.map(r =>
        isNaN(r)
            ? r.split('').map(rm => alpha[rand(0, alpha.length)]).join('')
            : pad(rand(0, r), r.toString().length)
    ).join(sep);
};

const emoji = {
    heart: '❤',
    empty_heart: '🖤',
    recycle: '↺',
    empty_recycle: '♻',
    check: '✔'
};

const absolutePath = (filepath) => path.join(__dirname, filepath);

/**
 * @property {String} dateFormats.twitter ddd MMM DD hh:mm:ss Z YYYY
 * @property {String} dateFormats.ff5_users YYYY-MM-DD
 * @property {String} dateFormats.fritease MMM DD, hh:mm a
 * @property {String} dateFormats.images MM/DD/YYYY
 * @property {String} dateFormats.ui MM/DD
 * @description For formatting dates.   
 */
const dateFormats = {
    twitter: 'ddd MMM DD hh:mm:ss Z YYYY',
    ff5_users: 'YYYY-MM-DD',
    fritease: 'MMM DD, hh:mm a',
    images: 'MM/DD/YYYY',
    ui: 'MM/DD'
};

const formatTwitterDate = (m) => {
    var results = moment();
    try {
        results = moment(m, dateFormats.twitter);
    }
    catch (e) {
    }
    return results.format(dateFormats.fritease);
}

/**
 * 
 * @param {Moment} date Starting date
 * @returns {Moment} If _date_ is not a Friday, returns the previous Friday
 */
const lastFriday = (date) => {
    while(date.day() !== 5) {
        date.add(-1, 'd');
    }
    return date;
}

/**
 * 
 * @param {Moment} date Starting date
 * @returns {Moment} If _date_ is not a Friday, returns the next following Friday
 */
const nextFriday = (date) => {
    while(date.day() !== 5) {
        date.add(1, 'd');
    }
    return date;
}

/**
 * 
 * @param {Moment} date Starting date
 * @returns {Moment} If _date_ is not a Thursday, returns the next following Thursday
 */
const nextThursday = (date) => {
    while(date.day() !== 4) {
        date.add(1, 'd');
    }
    return date;
}

const log = (str) => console.log(str);

module.exports = {
    absolutePath,
    asNum,
    config,
    /**
     * @property {String} dateFormats.twitter ddd MMM DD hh:mm:ss Z YYYY
     * @property {String} dateFormats.ff5_users YYYY-MM-DD
     * @property {String} dateFormats.fritease MMM DD, hh:mm a
     * @property {String} dateFormats.images MM/DD/YYYY
     * @property {String} dateFormats.ui MM/DD
     * @description For formatting dates.   
     */
    dateFormats,
    emoji,
    fs,
    formatTwitterDate,
    getFile,
    guid,
    lastFriday,
    log,
    moment,
    nextFriday,
    nextThursday,
    path,
    rand,
    stringOrNull,
    sqlString
}
