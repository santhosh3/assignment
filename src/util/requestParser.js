// parsing input request

const getRequestParams = (req) => {
    let allParams = {};
    let params = req.params || {};
    let body = req.body || {};
    let query = req.query || {};
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        allParams[key] = params[key];
      }
    }
  
    for (let key in body) {
      if (allParams[key] === undefined) {
        allParams[key] = body[key];
      }
    }
  
    for (let key in query) {
      if (allParams[key] === undefined) {
        allParams[key] = (query[key]);
      }
    }
  
    return allParams;
  };

module.exports = getRequestParams;