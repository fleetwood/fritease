const moment = require('moment');

class Query {
    constructor(options) {
        this._value = {};
        if (options) {
            if (options.friTease) this.FriTease();
            if (options.fromDate) this.fromDate(options.fromDate);
            if (options.toDate) this.toDate(options.toDate);
            if (options.filterRetweets) this.filterRetweets();
            if (options.count) this.limit(options.count);
        }
    }

    get twitterDate() {
        return 'YYYYMMDDHHmm'
    }

    get mode() {
        return this._mode || 'extended';
    }
    
    set mode(val) {
        this._mode = val;
    }

    get count() {
        return this._count || 1000;
    }

    set count(num) {
        this._count = num;
    }

    get startDate() {
        return this._startDate || new moment();
    }

    /**
     * @param {Moment} date
     * @description A formatted string may be passed, and will be converted to a Moment
     */
    set startDate(date) {
        if (typeof date === 'string') {
            date = new moment(date);
        }
        this._startDate = date;
    }

    get endDate() {
        return this._endDate || new moment();
    }

    /**
     * @param {Moment} date
     * @description A formatted string may be passed, and will be converted to a Moment
     */
    set endDate(date) {
        if (typeof date === 'string') {
            date = new moment(date);
            if (date > moment()) {
                date = moment();
            }
        }
        this._endDate = date;
    }

    get value() {
        return this._value;
    }

    set value(obj) {
        this._value = obj;
    }

    fromDate(date = this.startDate) {
        this.startDate = date;
        this._value.fromDate = this.startDate.format(this.twitterDate);
        return this;
    }

    toDate(date = this.endDate) {
        this.endDate = date;
        this._value.toDate = this.endDate.format(this.twitterDate);
        return this;
    }

    filterRetweets() {
        console.log('filterRetweets not implented.');
        return this;
        this._value += ' -filter:retweets';
    }

    FriTease() {
        this._value.query = `#FriTease`;
        return this;
    }

    limit(num) {
        this._value.maxResults = num;
    }

    toQuery() {
        return this.value;
    }
}

module.exports = Query;