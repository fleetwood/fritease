const Status = require('./Status');

class StatusQuote extends Status {
    constructor(params, mapType) {
        super(params, mapType);
        this.quote_status = new Status(params.quoted_status);
    }
    get quote_status_id() {
      return this._quote_status_id || null;
    }
    get quote_status() {
      return this._quote_status || null;
    }
    set quote_status(val) {
      this._quote_status = val;
      if (val && val.id) {
        this._quote_status_id = val.id;
      }
    }

    toTable() {
      let map = super.toTable();
          map.quote_status_id = this.quote_status_id;
      return map;
    }

    save() { return new Promise((resolve, reject) => {
        this.quote_status.save()
          .then(resolve(super.save()))
          .catch(e => reject(e));
      });
    }
}

module.exports = StatusQuote;
