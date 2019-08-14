/**
 * Send a status error.
 * @param {Response} res Inject the response body
 * @param {Error} e Provide the error message
 * TODO: status code
 */
const renderError = (res, e) => {
    console.log(e);
    return res.send({ status: 500, ...e });
}

/**
 * Render html version of errors for UI display.
 * @param {Response} res Inject the response body
 * @param {Error} e Provide the error message.
 * @param {String?} path (Optional) Path to error template. Default 'partials/error'
 * TODO: status code
 */
const renderUiError = (res, e, path) => {
    console.log(e);
    let message = '';
    if (e.allErrors) {
        e.allErrors.forEach(error => message += error.message + '<br />');
    }
    else {
        message = e.message || JSON.stringify(e);
    }
    res.render(path || 'partials/error', { message, layout: false });
}

module.exports = {
    renderError,
    renderUiError
}