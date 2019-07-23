/**
 * @description A class to manage adding Users to sessionStorage
 * @see cref:comp/twitter/Users
 */
class FF5 {

    /**
     * @property {String} 'data-ff5-id
     */
    static get ff5tag() {
        return 'data-ff5-id';
    }

    /**
     * @property {String} "[FF5.ff5tag]"
     */
    static get ff5attr() {
        return `[${FF5.ff5tag}]`;
    }

    /**
     * 
     * @param {CustomEvent} event One of the FF5 custom events
     * @param {String} message Attach a message to the event
     * @see cref:Events
     */
    static dispatch(event, message) {
        document.dispatchEvent(new CustomEvent(event, {bubbles:true, detail: {message}}));
    }

    /**
     * @property {CustomEvent} Events.updated 'When a user is added to or removed from FF5'
     * @property {CustomEvent} Events.notice "A notice or error from FF5"
     */
    static Events = {
        updated: 'ff5-updated',
        notice: 'ff5-notice'
    }

    /**
     * 
     * @param {Object} data The user's id and screen_name, bc Twitter is unreliable
     * @param {Number} data.user_id The user's twitter id
     * @param {String} data.screen_name The user's screen_name
     */
    static add(data) {
        if (sessionStorage.length >= 5) {
            FF5.dispatch(FF5.Events.notice,'Already five items in storage!');
            return;
        }
        if (FF5.get(data.user_id)) {
            FF5.dispatch(FF5.Events.notice,'That user has already been added!');
            return;
        }
        $.ajax({
            url: '/api/user',
            data,
            error: (err) => FF5.dispatch(FF5.Events.notice,err),
            success: (result) => {
                sessionStorage.setItem(result.id, JSON.stringify(result));
                FF5.updateButtons();
                FF5.dispatch(FF5.Events.updated,'Added user!');
            }
        });
    }

    /**
     * 
     * @param {Number} id The user id to remove from storage (Strings will be converted to Number)
     */
    static get(id) {
        let result = sessionStorage.getItem(id);
        if (result) {
            return JSON.parse(result);
        }
        return null;
    }

    /**
     * 
     * @param {Object} data The user's id and screen_name, bc Twitter is unreliable
     * @param {Number} data.user_id The user's twitter id
     * @param {String} data.screen_name The user's screen_name (Not used)
     */
    static remove(data) {
        if (FF5.get(data.user_id)) {
            sessionStorage.removeItem(data.user_id);
            FF5.updateButtons();
            FF5.dispatch(FF5.Events.updated,'User removed!');
        }
        else {
            FF5.dispatch(FF5.Events.notice, `User ${data.user_id} not found.`);
        }
    }

    /**
     * @property {Number} count The number of items in FF5 sessionStorage
     */
    static get count() {
        return sessionStorage.length;
    }

    /**
     * @description The number of slots remaining.
     */
    static get remaining() {
        return 5 - FF5.count;
    }

    /**
     * @description Updates all buttons on screen with an attribute of _data-ff5-id_
     */
    static updateButtons() {
        let remaining = FF5.remaining
            , buttons = FF5.ff5attr;

        if (remaining<1) {
            $(buttons)
                .html(`FF5 FULL (${remaining})`)
                .parent().addClass('disabled');
        }
        else {
            $(buttons)
                .html(`Add to FF5 (${remaining})`)
                .parent().removeClass('disabled');
        }
    }

    /**
     * @function all Returns all items in the FF5 sessionStorage
     */
    static get all() {
        let all = [];
        for (var i = 0; i < sessionStorage.length; i++){
            let item = sessionStorage.getItem(sessionStorage.key(i));
            all.push(item);
        }
        return all.map(u => JSON.parse(u));
    }

    /**
     * @function clear Removes all items from FF5 sessionStorage
     */
    static clear() {
        sessionStorage.clear();
        FF5.updateButtons();
        FF5.dispatch(FF5.Events.updated,'Storage cleared!');
    }
    
    static init() {
        
        $('body').on('click', '[data-ff5-id]', (e) => {
            const t = $(e.target);
            const data = {
                user_id: Number(t.attr('data-ff5-id')), 
                screen_name: t.attr('data-ff5-name')
            }
            FF5.add(data);
        });

        $('body').on('click', '[data-ff5-remove-id]', (e) => {
            const t = $(e.target);
            const data = {
                user_id: Number(t.attr('data-ff5-remove-id'))
            }
            FF5.remove(data);
        });

        $('body').on('click', '#global-ff5-clear', (e) => {
            FF5.clear();
        });

        document.addEventListener(FF5.Events.notice,(e) => {
            OnRender.showAlert({title: 'FF5 Notice', message: e.detail.message, type: 'warning'});
        });

        document.addEventListener(FF5.Events.updated,(e) => {
            OnRender.showAlert({title: 'FF5 updated.', message: e.detail.message, type: 'success'});
        });

        FF5.updateButtons();
    }
}

exports = FF5;