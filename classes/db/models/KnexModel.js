const db = require('./../DB')
    , utils = require('./../../utils')
    , knex = db.knex;
    
const pushConcat = (arr, val) => {
    if (Array.isArray(val)) {
        arr = arr.concat(val);
    }
    else if (!arr.find(f => f === val)) {
        arr.push(val);
    }
    return arr;
}

class KnexModel {
    constructor(table_name, id) {
        require('./../mappings/Mappings')(this);
        this._table_name = table_name;
        this._id = id;
        this._dependents = [];
    }

    static get modelTypes() { return db.Models; }
    
    get db() {
        return db;
    }

    static get mapTypes() {
        return {
            twitterToStatus: 'twitterToStatus',
            dbToStatus: 'dbToStatus'
        }
    }

    get table_name() {
      return this._table_name;
    }
    set table_name(val) {
      this._table_name = val;
    }
    get id() {
      return this._id;
    }
    set id(val) {
      this._id = val;
    }

    toTable() {
        console.log(`Define in child class`);
    }

    stringToHtml(str) {
        return str ? str.toHtmlBr() : null;
    }
    
    async save() { return new Promise((resolve, reject) => {
        console.log(`Saving (KnexModel) ${this.id}...`);
        const doQuery = async (item) => await new Promise((resolve, reject) => {
            let query, action;
            db.fetch(item.table_name, {id: item.id})
                .then(r => {
                    if (r && r.id) {
                        action = 'Updated';
                        query = knex(item.table_name)
                            .update(item.toTable(), ['id'])
                            .where({id: item.id})
                            .toString();
                    }
                    else {
                        action = 'Saved';
                        query = knex(item.table_name)
                            .insert(item.toTable(), ['id'])
                            .toString();
                    }
                    knex.raw(query)
                        .then(res => {
                            const id = res.rows[0].id;
                            console.log(`\t${action} ${item.table_name} successful for ${id}`);
                            resolve({id});
                        })
                        .catch(e => {
                            console.log(`\t${action} ${item.table_name} FAILED for ${item.id}`);
                            reject(e);
                    });
                })
                .catch(e => reject(e));
            });
        this._dependents.forEach(async d => await doQuery(d));
        doQuery(this)
            .then(id => resolve({id}))
            .catch(e => {
                console.log(`Error saving this ${this.id}`);
                reject(e);
            })
    })};
}

module.exports = KnexModel;
