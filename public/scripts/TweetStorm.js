/**
 * @param {Object} options
 * @param {String} options.modalUrl Url of the modal ui api
 * @param {String} options.imageUrl Url of the image api
 * @param {String} options.contentContainer Unique id of the content div
 * @param {String} options.imageContainer Unique id of the imageContainer div
 * @param {String} options.textForm Unique id of the textForm form
 * @param {String} options.loader Unique id of the loading div (Optional)
 */
(function ($) {
    $.fn.tweetStorm = function (options) {
        var settings = $.extend({
            limit: 10,
            promptImage: {
                date: '',
                imageUrl: '',
                theme1: '',
                theme2: ''
            },
            promptImg: '#prompt-image'
        }, options);

        const nextFriday = (format = 'MM/DD/YYYY') => {
            let date = moment()
            while (date.day() !== 5) {
                date.add(1, 'd');
            }
            return date.format(format);
        }

        settings.promptImage.date = nextFriday();

        const urlParams = new URLSearchParams(window.location.search)
            , fromDate = urlParams.get('fromDate')
            , defaultText = `#FriTease [date]
THEME 1: "[THEME_1]"
THEME 2: "[THEME_2]"

#FF 5 peeps to follow 👁👁:
[FF1]
[FF2]
[FF3]
[FF4]
[FF5]

L/RT your favorites!
@PromptList @PromptAdvant @thewritelist @writevent`;

        let me = this
            , contentContainer = $(settings.contentContainer)
            , imageContainer
            , textForm
            , loader = settings.loader ? $(settings.loader) : null;

        const render = (val) => {
            contentContainer.html(val);
            OnRender.watchRender(settings.textForm, () => {
                $(settings.textForm).keyup(this.setCurrent());
                showModal(true);
                getImage();
            });
            // showLoader(false);
        }

        const renderImage = (val) => {
            $(settings.imageContainer).html(val);
            OnRender.watchRender(settings.imageContainer,() => {
                this.setCurrent();
            });
            // showLoader(false);
        }

        const showModal = (show) => {
            this.attr('style', show ? 'z-index: 4002; display: block;' : '');
        }

        const showLoader = (loading) => {
            const hidden = 'u-hiddenVisually';
            if (loader && contentContainer) {
                const set = loading ? [loader, contentContainer] : [contentContainer, loader];
                set[0].removeClass(hidden);
                set[1].addClass(hidden);
            } else if (loader) {
                if (loading) loader.addClass(hidden);
                else loader.removeClass(hidden);
            }
        }

        const getImage = () => {
            $.ajax({
                url: settings.imageUrl,
                data: { date: settings.promptImage.date },
                error: (err => render(err.statusText)),
                success: (result => renderImage(result))
            });
        };

        const getStream = () => {
            // showLoader(true);
            showModal(false);
            $.ajax({
                url: settings.modalUrl,
                data: { ...settings },
                error: (err) => render(err.statusText),
                success: (result) => render(result)
            });
        }

        this.setCurrent = () => {
            textForm = $(settings.textForm);
            const promptImage = $(settings.promptImg);
            let text = defaultText;

            FF5.all
                // first add all FF5 users from sessionStorage
                .map((user, index) => {
                    return {
                        term: `[FF${index + 1}]`,
                        replace: '@' + user.screen_name
                    };
                })
                // Apply attributes for the current image
                .concat([
                    { term: '[date]', replace: promptImage ? promptImage.attr('data-prompt-date') : '' },
                    { term: '[THEME_1]', replace: promptImage ? promptImage.attr('data-prompt-theme1') : '' },
                    { term: '[THEME_2]', replace: promptImage ? promptImage.attr('data-prompt-theme2') : '' }
                ])
                // then iterate through the results and update the default text
                .forEach(r => text = text.replace(r.term, r.replace));
            textForm.val(text);
        }

        this.addUser = (params) => {
            // TODO add FF users
            // $('.fritease-control').keyup(e => setCurrent());
            setCurrent();
        }

        ////////////////////////////////////
        // set up event listeners
        this.click(e => {
            const mid = me.attr('id');
            const bid = $(settings.closeButton).attr('id');
            const cid = $(e.target).attr('id');
            if (cid === mid || cid == bid) {
                showModal(false);
            }
        });

        $(settings.showButton).click(e => getStream());

        $('body').on('click', '.SendTweetsButton',(e) => {
            $.ajax({
                url: '/api/postPrompt',
                type: 'GET',
                contentType: 'application/json',
                data: {
                    statusText: textForm.val(),
                    imageUrl: $(settings.promptImg).attr('src')
                },
                error: (err) => FF5.dispatch(FF5.Events.notice, err.statusText),
                success: () => FF5.dispatch(FF5.Events.notice, `Tweet scheduled for ${$(settings.promptImg).attr('data-prompt-date')}!`)
            });
        });

        return this;
    };

}(jQuery));