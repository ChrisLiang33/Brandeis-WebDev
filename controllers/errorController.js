//error controller handles errror gracefully
const httpStatus = require("http-status-codes");

//page not found error
exports.pageNotFoundError = (req, res) => {
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.render("error");
};

//internal server error
exports.internalServerError = (error, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    console.log(`ERROR occurred: ${error.stack}`);
    res.status(errorCode);
    res.send(`${errorCode} | Sorry, our application is taking a nap!`);
};
