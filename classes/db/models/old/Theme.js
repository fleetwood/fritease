const KnexModel = require('../KnexModel');
const table_name = 'fritease_themes';

class Theme extends KnexModel {
  constructor(params) {
    super(table_name);
    this._id = params.id;
    this._date = params.date;
    this._url = params.url;
    this._theme1 = params.theme1;
    this._theme2 = params.theme2;
  }

  get id() {
    return this._id;
  }
  set id(val) {
    this._id = val;
  }
  get date() {
    return this._date;
  }
  set date(val) {
    this._date = val;
  }
  get url() {
    return this._url;
  }
  set url(val) {
    this._url = val;
  }
  get theme1() {
    return this._theme1;
  }
  set theme1(val) {
    this._theme1 = val;
  }
  get theme2() {
    return this._theme2;
  }
  set theme2(val) {
    this._theme2 = val;
  }

}

module.exports = Theme;
