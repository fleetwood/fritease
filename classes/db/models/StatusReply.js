const Status = require('./Status');

class StatusReply extends Status {
    constructor(params, mapType) {
        super(params, mapType);
        // TODO: what if the status hasn't been saved in db yet?
        this._reply_to_status_id = new Status(params.in_reply_to_status_id)
    }
    
    get reply_status_id() {
      return this._reply_to_status_id || null;
    }
    get reply_status() {
      return this._reply_status || null;
    }
    set reply_status(val) {
      this._reply_status = val;
      if (val && val.id) {
        this._reply_to_status_id = val.id;
      }
    }

    toTable() {
      let map = super.toTable();
          map.reply_status_id = this.reply_status_id;
      return map;
    }
}

module.exports = StatusReply;
