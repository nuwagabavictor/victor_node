const GlobalException = (message, code) => {
    const err = new Error(message);
    err.code = code;
    throw err;
}

module.exports = GlobalException;