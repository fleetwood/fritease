const knex = require('./db/knex')
    , utils = require('./utils')
    , moment = utils.moment
    , SMS = require('./SMS')
    , twitter = require('./twitter');

const sendMessage = (message, error) => {
    // SMS.send(message);
    console.log(message);
    if (error) {
        console.error(e.stack);
    }
}

const MMDDhhss = 'MM/DD hh:ss';

class ScheduledItem {
    /**
     * A scheduled item to be triggered at a specific time.
     * @param {moment} date Trigger date
     * @param {String} message Sent when dueDate is past and prompt exists
     * @param {String} notice Sent when dueDate is past and prompt does not exist
     * @param {Function} action [Optional] Callback function
     */
    constructor(date, message, notice, action) {
        this._dueDate = date;
        this._message = message;
        this._notice = notice;
        this._action = action;
    }

    get isReady() {
        console.log(`Checking dueDate: ${moment.format(MMDDhhss)} ${s.dueDate.format(MMDDhhss)}`);
        return moment() > this.dueDate;
    }

    get dueDate() {
        return this._dueDate;
    }

    action(hasPrompt) {
        this._dueDate.add(1, 'w');
        let message = hasPrompt ? this._message : this._notice;
        sendMessage(message);
        return this._action;
    }
}

// TODO: Needs to be automatically updating
// 1. Determine when the next scheduled date should be (nextThursday)
// 2. Check the database for the first incompleted post for that date
// 2. If one is found, pass the schedules
// 3. If their times are expired (nextThursday add(x,i))....
    // 3a.  send SMS and execute additional actions
    // 3b.  increment schedule date by one week
class Scheduler {
    constructor() {
        this.scheduledTime = this.nextThursday;
        let first = this.scheduledTime.add(8, 'h'),
            second = first.add(16, 'h'),
            prompt = second.add(18, 'h');
        this._schedules = [
            new ScheduledItem({
                dueDate: first,
                message: 'Prompt is ready!',
                notice: 'You better schedule a prompt!!'
            }),
            new ScheduledItem({
                dueDate: second,
                message: 'Prompt is ready!',
                notice: 'Prompt is due to go out in 2 hours. Schedule something!!'
            }),
            new ScheduledItem({
                dueDate: first,
                message: 'Posting FriTease!',
                notice: 'FriTease is overdue!!',
                action: () => {
                    twitter.postScheduledPrompt(this.scheduledTime)
                        .then(url => sendMessage(`Posted FriTease! ${url}`))
                        .catch(e => sendMessage('WARNING: FAILED TO POST FRITEASE! BETTER SEND NOW!', e));
                }
            })
        ];
        this.init();
    }

    init() {
        this.watcher = setInterval(() => {
            this.watchSchedules();
            if (this.count++ > 20) { // TODO: REMOVE DEBUG
                console.log(`END`);
                clearInterval(this.watcher);
                process.exit(0);
            }
        }, 10000);
    }

    watchSchedules() {
        console.log(`Watching...`);
        if (!this.isThursday) {
            // TODO
            // return;
        }
        if(this._scheduledPrompt === null) {
            twitter.getScheduledPrompt(this.scheduledTime)
                .then(result => this._scheduledPrompt = result)
                .catch(e => sendMessage(`WARNING: There is a problem with the prompt!!`, e));
        }
        else {
            this.checkSchedules();
        }
    }

    checkSchedules() {
        console.log('Checking schedules...')
        this._schedules.forEach(s => {
            if (s.isReady) {
                s.action(this._scheduledPrompt != null);
            }
        });
    }

    /**
     * @property {Boolean} isThursday Is today a thursday?
     */
    get isThursday() {
        return moment().day() === 4;
    }

    /**
     * @property {moment} nextThursday Gets the next upcoming Thursday
     */
    get nextThursday() {
        let thurs = utils.nextThursday(moment()).startOf('day');
        console.log(`Next thursday ${thurs.format('MM/DD')}`);
        return thurs;
    }
}

// let schedule = new Scheduler(); // TODO: debugging

module.exports = Scheduler;
