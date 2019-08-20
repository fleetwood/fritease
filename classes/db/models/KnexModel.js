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
        // TODO: UR HERE
        // Need to set the KnexModel type in the constructor,
        // probably corrollary to tableName, so that dependents[]
        // can iterate through each type and save them properly,
        // then handle lookups. -OR- think of another way to update
        // lookup tables to children KnexModel object...
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

    addDependent(knexModelItem) {
        this._dependents.push(knexModelItem);
    }

    toTable() {
        console.log(`Define in child class`);
    }

    stringToHtml(str) {
        return str ? str.toHtmlBr() : null;
    }
    
    async save() { return new Promise((resolve, reject) => {
        console.log(`Saving ${this.id}...`);
        let query, action;
        db.fetch(this.table_name, {id: this.id})
            .then(r => {
                if (r && r.id) {
                    action = 'Updated';
                    query = knex(this.table_name)
                        .update(this.toTable())
                        .where({id: this.id})
                        .toString();
                }
                else {
                    action = 'Saved';
                    query = knex(this.table_name)
                        .insert(this.toTable())
                        .toString();
                }
                knex.raw(query)
                    .then(res => {
                        console.log(`\t${action} ${this.table_name} successful for ${this.id}`);
                        resolve(res);
                    })
                    .catch(e => {
                        console.log(`\t${action} ${this.table_name} FAILED for ${this.id}`);
                        reject(e);
                });
            })
            .catch(e => reject(e));

        const saveDependents = async() => {
            console.log(`\tsaveDependents()...`);
            await Promise.all([
                this._dependents.forEach(async item => await item.save())
            ]);
        };
        
        const write = async() => {
            console.log(`\twrite()...`);
        };

        const updateLookups = async() => {
            console.log(`\tupdateLookups()...`);
            this._dependents.forEach(async dependent => {
                switch (dependent.type) {
                    case KnexModel.modelTypes.USER :
                    case KnexModel.modelTypes.STATUS :
                    case KnexModel.modelTypes.MEDIA :
                    case KnexModel.modelTypes.THEME :
                    case KnexModel.modelTypes.PROMPT :
                        console.log(`Write update lookups for ${document.type}`);
                }
            })
        }

        // Promise.all([
        //     await getCurrent(),
        //     saveDependents(),
        //     await write(),
        //     updateLookups(),
        //     async() => await console.log(`\tCOMPLETE`)
        // ]);
    })};
    
    // fetch(where) { return new Promise((resolve, reject) => {
    //     knex(this.table_name)
    //         .select('*')
    //         .where(where)
    //         // TODO: handle joins
    //         .then(results => {
    //             // TODO: handle mapping
    //             resolve(results);
    //         })
    //         .catch(e => {
    //             // TODO: handle errors
    //             reject(e);
    //         });
    //     });
    // }

    // delete() {

    // }
}

module.exports = KnexModel;
