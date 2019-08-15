const db = require('./../DB')
    knex = db.knex;

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
    constructor(table_name, pk =  null) {
        this._table_name = table_name;
        this._pk = pk;
        this._props = [];
    }

    get db() {
        return db;
    }
    get table_name() {
      return this._table_name;
    }
    set table_name(val) {
      this._table_name = val;
    }
    get pk() {
      return this._pk;
    }
    set pk(val) {
      this._pk = val;
    }
    get props() {
      return this._props;
    }
    set props(val) {
      this._props = pushConcat(this._props, val);
    }
    get dependents() {
      return this._dependents;
    }
    set dependents(val) {
        this._dependents = pushConcat(this._dependents, val);
    }

    /**
     * 
     * @param {Array<props>} props Array of props to add
     * @param {JSON} params The values to store in the props
     * @param {String} prop.k The Model key
     * @param {String} prop.v If the Model key is different than the param key
     * @param {Boolean} prop.pk Whether this prop is the primary key or not. (Used for upsert) Optional. Default _null_
     * @param {Boolean} prop.d Whether this prop is a dependent. (Used in joins and upserts.) Optional. Default _false_
     */
    addProps(props, params) {
        props.forEach(prop => {
            this.addProp(
                `_${prop.k}`, 
                params[prop.v || prop.k], 
                prop.d || false, 
                prop.pk || null
            );
        });
    }
    addProp(key, val, dependent = false, pk = null) {
        this[key]=val;
        this.props(key);
        if (dependent) {
            this.dependents(key);
        }
        if (pk !== null) {
            this.pk = pk;
        }
    }
    save() {
        // TODO: iterate through child KnexModel objects and save those first
        // for example: if saving a Status, first save the User...
        return new Promise((resolve, reject) => {
            const insert = knex(this.table_name)
                .insert(this.props)
                .toString();

            const update = knex(this.table_name)
                .update(this.props)
                .whereRaw(`${this.table_name}.${this.pk} = ?`, [this.props[this.upsert_match]])
                .toString();

            const query = `${insert} 
                ON CONFLICT (${this.pk}) 
                DO UPDATE 
                SET ${update.replace(/^update\s.*\sset\s/i, '')}`;

            knex.raw(query)
                .then(res => resolve(res))
                .catch(e => reject(e));
        });
    }

    fetch(where) { return new Promise((resolve, reject) => {
        knex(this.table_name)
            .select('*')
            .where(where)
            // TODO: handle joins
            .then(results => {
                // TODO: handle mapping
                resolve(results);
            })
            .catch(e => {
                // TODO: handle errors
                reject(e);
            });
        });
    }

    delete() {

    }
}

module.exports = KnexModel;
