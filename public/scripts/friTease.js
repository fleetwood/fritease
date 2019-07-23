$(document).ready(function () {
    const streamContent = $('#stream-content');
    const streamLoading = $('#stream-loading');
    
    const urlParams = new URLSearchParams(window.location.search);

    const render = (content) => {
        streamContent.html(content);
        loadVisibility(false);
    }

    const formats ={
        moment: 'YYYY-MM-DD',
        picker: 'yyyy-mm-dd'
    };

    // because some tweets may have posted on Thursday
    const lastThursday = (yyyymmdd) => {
        let thurs = moment(yyyymmdd);
        while(thurs.day() !== 4) {
            thurs.add(-1, 'd');
        }
        return thurs.format(formats.moment);
    }

    const loadVisibility = (loading) => {
        const hidden = 'u-hiddenVisually';
        const set = loading ? [streamLoading, streamContent] : [streamContent,streamLoading];
        set[0].removeClass(hidden);
        set[1].addClass(hidden);
    }
        
    const getStream = () => {
        loadVisibility(true);
        $.ajax({
            url: "api/ui/friTease",
            data: {
                friTease: true,
                retweets: false
            },
            error: (err) => {
                render(err.statusText);
            },
            success: (result) => {
                render(result);
            }
        });
    }

    getStream();
});