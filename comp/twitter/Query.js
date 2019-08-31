const utils = require('./../utils')
    , moment = utils.moment;

class Query {
    /**
     * 
     * @param {Boolean} options.friTease Set this is a FriTease query
     * @param {moment} options.fromDate Can be a moment or string
     * @param {moment} options.toDate Can be a moment or string
     * @param {Boolean} options.filterRetweets Whether or not to include retweets
     * @param {Number} options.count Limit the number of returns
     */
    constructor(options) {
        this._value = {};
        if (options) {
            if (options.friTease) this.FriTease();
            if (options.fromDate) this.fromDate(options.fromDate);
            if (options.toDate) this.toDate(options.toDate);
            if (options.filterRetweets) this.filterRetweets();
            if (options.count) this.limit(options.count);
            if (options.next) this.next(options.next);
        }
    }

    get twitterDate() {
        return 'YYYYMMDDHHmm'
    }

    /**
     * NOT IN USE
     */
    get mode() {
        return this._mode || 'extended';
    }
    
    set mode(val) {
        this._mode = val;
        return this;
    }

    get count() {
        return this._count || 1000;
    }

    set count(num) {
        this._count = num;
        return this;
    }

    get startDate() {
        return this._startDate || utils.lastThursday;
    }

    /**
     * Use Chained method @cref=fromDate to build Query
     * @param {Moment} date
     * @description A formatted string may be passed, and will be converted to a Moment. Default lastThursday
     * @see utils.lastThursday, Query.fromDate
     */
    set startDate(date) {
        if (!date) {
            date = utils.lastThursday
        }
        else if (typeof date === 'string') {
            date = new moment(date);
        }
        this._startDate = date;
        return this;
    }

    get endDate() {
        return this._endDate || utils.nextThursday;
    }

    /**
     * Use Chained method @cref=toDate to build Query
     * @param {Moment} date
     * @description A formatted string may be passed, and will be converted to a Moment. Default nextThursday
     * @see utils.nextThursday
     */
    set endDate(date) {
        if (!date) {
            date = utils.nextThursday
        }
        else if (typeof date === 'string') {
            date = new moment(date);
            if (date > moment()) {
                date = moment();
            }
        }
        this._endDate = date;
        return this;
    }

    get value() {
        return this._value;
    }

    set value(obj) {
        this._value = obj;
    }

    /**
     * Chainable method for building a query.
     * @param {moment} date The date to begin the search.
     */
    fromDate(date = this.startDate) {
        this.startDate = date;
        this._value.fromDate = this.startDate.format(this.twitterDate);
        return this;
    }

    /**
     * Chainable method for building a query.
     * @param {moment} date The date to end the search
     */
    toDate(date = this.endDate) {
        this.endDate = date;
        this._value.toDate = this.endDate.format(this.twitterDate);
        return this;
    }

    /**
     * Chainable method to filter out retweets from search.
     */
    filterRetweets() {
        console.log('filterRetweets not implented.');
        this._value += ' -filter:retweets';
        return this;
    }

    /**
     * Chainable method to search against #FriTease hashtag.
     */
    FriTease() {
        this._value.query = `#FriTease`;
        return this;
    }

    /**
     * 
     * @param {Number} num Chainable method to limit the number of results in search.
     */
    limit(num) {
        this._value.maxResults = num;
        return this;
    }

    next(val) {
        if (val !== "false") {
            val = val.replaceAll('=','');
            this._value.next = val;
        }
        return this;
    }

    /**
     * Emits a proper search-object options for Twit. NOTE: CALL ALL CHAINED METHODS FIRST!
     */
    toQuery() {
        return this.value;
    }
}

module.exports = Query;