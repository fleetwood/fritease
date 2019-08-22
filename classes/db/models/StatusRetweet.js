const Status = require('./Status');

class StatusRetweet extends Status {
    constructor(params, mapType) {
        super(params, mapType);
        this.retweet_status = new Status(params.retweeted_status) || null;
    }
    get retweet_status_id() {
      return this._retweet_status_id || null;
    }
    get retweet_status() {
      return this._retweet_status || null;
    }
    set retweet_status(val) {
      this._retweet_status = val;
      if (val && val.id)  {
        this._retweet_status_id = val.id;
      }
    }

    toTable() {
      let map = super.toTable();
          map.retweet_status_id = this.retweet_status_id;
      return map;
    }

    save() {
      console.log(`Saving (Retweet)`);
      if (this.retweet_status) {
        this._dependents.push(this.retweet_status);
      }
      return super.save();
    }
}

module.exports = StatusRetweet;
