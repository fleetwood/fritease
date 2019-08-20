const KnexModel = require('./KnexModel');
const table_name = 'fritease_prompts';

class Prompt extends KnexModel {
  constructor(params) {
    super(table_name);
    this._id = params.id;
    this._status_id = params.status_id;
    this._date = params.date;
  }

  get id() {
    return this._id;
  }
  set id(val) {
    this._id = val;
  }
  get status_id() {
    return this._status_id;
  }
  set status_id(val) {
    this._status_id = val;
  }
  get status() {
    return this._status;
  }
  set status(val) {
    this._status = val;
  }
  get date() {
    return this._date;
  }
  set date(val) {
    this._date = val;
  }
}

module.exports = Prompt;
