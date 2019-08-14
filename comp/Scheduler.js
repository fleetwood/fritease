const utils = require('./utils')
    , moment = utils.moment
    , SMS = require('./SMS')
    , twitter = require('./twitter');

const sendMessage = (message, error) => {
    SMS.send(message);
    console.log(message);
    if (error) {
        console.error(error.stack);
    }
}

class ScheduledItem {
    /**
     * A scheduled item to be triggered at a specific time.
     * @param {moment} options.date Trigger date
     * @param {String} options.message Sent when dueDate is past and prompt exists
     * @param {String} options.notice Sent when dueDate is past and prompt does not exist
     * @param {Function} options.action [Optional] Callback function
     */
    constructor(options) {
        this._dueDate = options.dueDate;
        this._message = options.message;
        this._notice = options.notice;
        this._action = options.action;
        this._problems = [];
    }

    get isDue() {
        return moment() > this.dueDate;
    }

    get dueDate() {
        return this._dueDate;
    }

    get problems() {
        return this._problems;
    }

    set problems(val) {
        this._problems = val;
    }

    setToNextWeek() {
    }

    complete() {
        if (this.problems.length > 0) {
            sendMessage(`${this._notice}\n\nISSUES:\n${JSON.stringify(this.problems)}`);
        }
        else {
            if (this._action) {
                this._action();
            }
            sendMessage(this._message);
        }
        this.problems = [];
        this._dueDate.add(1, 'w');
    }
}

class Scheduler {
    constructor() {
        this.scheduledTime = this.nextThursday;
        let wed = this.nextThursday.add(-12, 'h'),
            first = this.nextThursday.add(8, 'h'),
            second = this.nextThursday.add(16, 'h'),
            prompt = this.nextThursday.add(18, 'h');
        this._schedules = [
            new ScheduledItem({
                dueDate: wed,
                message: `Tomorrow's prompt is ready to go!`,
                notice: `FriTease goes out tomorrow. Better get on it.`
            }),
            new ScheduledItem({
                dueDate: first,
                message: `Today's prompt is ready to go!`,
                notice: `You better check on today's prompt.`
            }),
            new ScheduledItem({
                dueDate: second,
                message: 'Second prompt reminder. No problems detected.',
                notice: 'Prompt is due to go out in 2 hours!!!'
            }),
            new ScheduledItem({
                dueDate: prompt,
                message: 'Posting FriTease!',
                notice: 'FriTease is overdue!!',
                action: () => {
                    return this.postScheduledPrompt();
                }
            })
        ];
        this.init();
    }

    init() {
        // check every 15 minutes
        this.watcher = setInterval(() => {
            this.watchSchedules();
        }, 1000*60*15);
    }

    watchSchedules() {
        if (!this.isThursday) {
            return;
        }
        if (!this._scheduledPrompt) {
            twitter.getScheduledPrompt(this.scheduledTime)
                .then(result => {
                    this._scheduledPrompt = result;
                })
                .catch(e => sendMessage(`WARNING: There is a problem with the prompt!!`, e));
        }
        else {
            this.checkSchedules();
        }
    }

    checkSchedules() {
        this._schedules.forEach(s => {
            if (s.isDue) {
                if (!this._scheduledPrompt) {
                    s.problems.push('No prompt is scheduled!')
                }
                else if (JSON.parse(this._scheduledPrompt.ff5_users).length < 5) {
                    s.problems.push('Need to select FF5 users!')
                }
                s.complete();
            }
        });
    }

    postScheduledPrompt() {
        let date = moment(this._scheduledPrompt.date);
        twitter.postScheduledPrompt(date)
            .then(url => sendMessage(`Posted FriTease! ${url}`))
            .catch(e => sendMessage('WARNING: FAILED TO POST FRITEASE! BETTER SEND NOW!', e));
        this._scheduledPrompt = null;
        this.scheduledTime.add(7, 'd');
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
        return thurs;
    }
}

module.exports = Scheduler;
