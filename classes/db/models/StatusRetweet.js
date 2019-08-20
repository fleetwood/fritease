const Status = require('./Status');

class StatusRetweet extends Status {
    constructor(params, mapType) {
        super(params, mapType);
        this.retweet_status = new Status(params.retweeted_status);
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

    save() { return new Promise((resolve, reject) => {
          this.retweet_status.save()
            .then(resolve(super.save()))
            .catch(e => reject(e));
      });
    }
}

module.exports = StatusRetweet;
