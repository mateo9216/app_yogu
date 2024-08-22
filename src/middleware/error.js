function error(message, code){
    const e = Error(message);
    if(code){
        e.statusCode = code;
    }

    return e;
}    

module.exports = error;