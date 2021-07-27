// let moment = require("moment-timezone");
let jwt = require("jsonwebtoken");
let request = require("request");
let fs = require("fs");
// let axios = require("axios");

// let baseModel = require('../models/baseModel')
let queryController = require("./databaseQueries");

async function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function convertToDate(date) {
  if (date) {
    return moment(date).hours(5).minutes(30).seconds(0).millisecond(0);
  } else {
    return date;
  }
}
function convertToDateWithoutZone(date) {
  if (date) {
    return moment(date).hours(0).minutes(00).seconds(0).millisecond(0);
  } else {
    return date;
  }
}
function convertToDateWith1day(date) {
  if (date) {
    return moment(date).hours(24).minutes(00).seconds(0).millisecond(0);
  } else {
    return date;
  }
}

function getDateDiff(startDate, endDate) {
  return moment(endDate).diff(startDate, "days");
}

let checkToken = (req, res, next) => {
  try {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
    if (token) {
      jwt.verify(token, config.authConfig.secrete, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            status: "failed",
            msg: "Token is Not Valid",
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(401).json({
        status: "failed",
        msg: "Auth Token Not Provided",
      });
    }
  } catch (error) {
    return res.status(401).json({
      status: "failed",
      msg: "Auth Token Not Provided",
      error: error,
    });
  }
};

let renameKeys = (keysMap, obj) =>
  Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...{
        [keysMap[key] || key]: obj[key],
      },
    }),
    {}
  );

let getUniversalCompletionTime = (timeStr) => {
  if (timeStr && timeStr.length > 0 && timeStr.match(/\d+/)) {
    let time = timeStr.match(/\d+/).length > 0 ? timeStr.match(/\d+/)[0] : 0;
    let unit = timeStr.match(/\d+/).length > 0 ? timeStr.split(time)[1] : "";

    let completionTimeObj = { unit: "Hours" };
    switch (unit) {
      case "minutes": {
        completionTimeObj.time = ((time / 60) * 100) / 100;
        return completionTimeObj;
        break;
      }
      case "days": {
        completionTimeObj.time = (time * 9 * 100) / 100;
        return completionTimeObj;
        break;
      }
      case "hours": {
        completionTimeObj.time = Number(time);
        return completionTimeObj;
        break;
      }
      default: {
        return {
          unit: "Hours",
          time: 0,
        };
        break;
      }
    }
  } else {
    return {
      unit: "Hours",
      time: 0,
    };
  }
};

//sorting function
let sort_by = function (field, reverse, primer) {
  let key = primer
    ? function (x) {
        return primer(x[field]);
      }
    : function (x) {
        return x[field];
      };

  reverse = !reverse ? 1 : -1;

  return function (a, b) {
    return (a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a));
  };
};

//api to send sms
var requestapi = function (url, form, cb) {
  request.post({ url: url, form: form }, function (err, httpResponse, body) {
    if (!err && httpResponse.statusCode === 200) {
      console.log("and");
      cb(null, body);
    } else {
      console.log(err);
      cb(err, body);
    }
  });
};

var requestapiPost = function (url, form, cb) {
  // console.log(form,url,'------,,,,,,')
  // return
  request.post(
    {
      url: url,
      headers: {
        "content-type": "application/json",
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhMjFkOTJlMi03M2IxLTQ1YzUtYTRjMS02ZWJkMDM5OGI5ZTciLCJ0eXBlIjoiYWNjZXNzIiwiZXhwIjoxODk2NDE1MzczLCJpYXQiOjE1ODEwNTUzNzMsIm5iZiI6MTU4MTA1NTM3MywiaWRlbnRpdHkiOiJkZXYudmFsdWVwaXRjaEBhYWRoYWFyYXBpLmlvIiwiZnJlc2giOmZhbHNlLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsicmVhZCJdfX0.JLDtJskYbjJj7l4k_IwYcVYaaFuOk5uNWt9q3TrnPIk",
      },
      form: form,
    },
    function (error, response, body) {
      if (error) {
        cb(error, body);
      } else {
        cb(null, body);
      }
    }
  );
};

var requestapiSPost = function (url, form, cb) {
  request.post(
    {
      url: url,
      headers: {
        "content-type": "application/json",
        Authorization: form.apiKey,
      },
      form: form,
    },
    function (error, response, body) {
      if (error) {
        cb(error, body);
      } else {
        cb(null, body);
      }
    }
  );
};

var requestapiFaceMatchPost = function (url, form, cb) {
  //console.log(form)
  request.post(
    {
      url: url,
      headers: {
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
      },
      form: form,
    },
    function (error, response, body) {
      if (error) {
        cb(error, body);
      } else {
        cb(null, body);
      }
    }
  );
};

// for zoop
var requestapiPostZoop = function (url, form, cb) {
  //console.log(form)
  request.post(
    {
      url: url,
      headers: {
        "content-type": "application/json",
        qt_api_key: "05e7bc88-f96b-4bbd-984b-001bbe068bad",
        qt_agency_id: "819da990-74af-4f4d-9c9d-ca34d249dee0",
      },
      form: form,
    },
    function (error, response, body) {
      if (error) {
        console.log("error:", error);
        cb(error, body);
      } else {
        console.log(body);
        cb(null, body);
      }
    }
  );
};

// without Authorization
var requestApiPost = function (url, form, cb) {
  request.post(
    {
      url: url,
      headers: {
        "content-type": "application/json",
      },
      body: form,
    },
    function (error, response, body) {
      if (error) {
        console.log("Inside requestApiPost error:", error);
        cb(error, body);
      } else {
        // console.log("requestApiPost Sending or returning body here");
        cb(null, body);
      }
    }
  );
};

var requestApiCreditReportPost = function (url, form, cb) {
  request.post(
    {
      url: url,
      headers: {
        "content-type": "application/json",
      },
      body: form,
    },
    function (error, response, body) {
      if (error) {
        console.log("Inside requestApiCreditReport error:", error);
        cb(error, body);
      } else {
        console.log("requestApiCreditReport Sending or returning body here");
        cb(null, body);
      }
    }
  );
};

//GET api method to send sms
let requestapiGet = function (url, cb) {
  //console.log(url)
  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      console.log("and");
      cb(null, body);
    } else {
      console.log("--------", error);
      cb(error, null);
    }
  });
};

var getWithParams = function (url, cb, field1, field2) {
  var request = require("request");
  var propertiesObject = { field1: field1, field2: field2 };
  request({ url: url, qs: propertiesObject }, function (err, response, body) {
    console.log("Get response: " + response.statusCode);
    if (err) {
      console.log(err);
      cb(null, body);
    } else {
      cb(error, null);
    }
  });
};

var requestApiUpload = async function (url, fileName, cb) {
  try {
    // console.log(fileName);
    request(
      {
        url: url,
        method: "POST",
        formData: {
          user: "vp_search",
          // Pass data via Buffers
          auth_token: "5980a361d8d5d63a63166fddbec8e3a2",
          file: await fs.createReadStream("uploads/" + fileName),
        },
      },
      function (err, httpResponse, body) {
        console.log(err, httpResponse, body);
        if (!err && httpResponse.statusCode === 200) {
          //console.log('and');
          cb(null, body);
        } else {
          console.log(err);
          console.log(body);
          cb(err, body);
        }
      }
    );
  } catch (err) {
    cb(err, null);
  }
};

// for data and pic together
var requestApiUpload2 = async function (url, fileName, data, cb) {
  try {
    console.log(fileName);
    let formData = {
      bank: data.bank,
      accountType: data.accountType,
      bankStmt: await fs.createReadStream("uploads/" + fileName),
    };
    request.post(
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        url: url,
        method: "POST",
        formData: formData,
      },
      function (err, httpResponse, body) {
        if (!err && httpResponse.statusCode === 200) {
          cb(null, body);
        } else {
          //console.log(httpResponse);
          console.log("=-=-=-= Error in err ", err);
          //console.log('==-==-',body);
          cb(err, body);
        }
      }
    );
  } catch (err) {
    cb(err, null);
  }
};

// for pan photo
var requestApiUpload3 = async function (url, fileName, cb) {
  try {
    // console.log(fileName);
    let formData = {
      base64: await (await Promise.resolve(base64_encode(fileName))).toString(),
      strict: "false",
      file: await Promise.resolve(fs.createReadStream("uploads/" + fileName)),
    };
    request.post(
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhMjFkOTJlMi03M2IxLTQ1YzUtYTRjMS02ZWJkMDM5OGI5ZTciLCJ0eXBlIjoiYWNjZXNzIiwiZXhwIjoxODk2NDE1MzczLCJpYXQiOjE1ODEwNTUzNzMsIm5iZiI6MTU4MTA1NTM3MywiaWRlbnRpdHkiOiJkZXYudmFsdWVwaXRjaEBhYWRoYWFyYXBpLmlvIiwiZnJlc2giOmZhbHNlLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsicmVhZCJdfX0.JLDtJskYbjJj7l4k_IwYcVYaaFuOk5uNWt9q3TrnPIk",
        },
        url: url,
        method: "POST",
        // responseType: 'string',
        formData: formData,
      },
      function (err, httpResponse, body) {
        if (!err && httpResponse.statusCode === 200) {
          // console.log('Kya main requestUpload3', body)
          cb(null, body);
        } else {
          console.log("=-=-=-= Error in requestUpload3 ", err);
          //console.log('==-==-',body);
          cb(err, body);
        }
      }
    );
  } catch (err) {
    console.log("oouch", err);
    cb(err, null);
  }
};

// for ocr
var requestApiUpload4 = async function (urlParam, fileName, cb) {
  try {
    // console.log(urlParam)
    let formData = {
      consent: "yes",
      file: await fs.createReadStream("uploads/" + fileName),
      type: urlParam.type,
    };
    console.log("formData", formData);
    // console.log(formData)
    console.log(urlParam.url);
    request.post(
      {
        headers: {
          "cache-control": "no-cache",
          "Content-Type": "multipart/form-data",
          "x-api-token": "eVGaFTVAkFRxSIjWgE0vbvKqUz8pVrfI",
          "x-api-secret": "QziADYjta8IPsQZfnhXKGOk3lmS2MSFp",
        },
        url: urlParam.url,
        method: "POST",
        formData: formData,
      },
      function (err, httpResponse, body) {
        // console.log(httpResponse,'========')
        if (!err && httpResponse.statusCode === 200) {
          // console.log('Kya main requestUpload4 hoo?', body)
          cb(null, body);
        } else {
          console.log("In utilities inside requestUpload4Function ", err);
          cb(err, body);
        }
      }
    );
  } catch (err) {
    console.log("oouch", err);
    cb(err, null);
  }
};

var requestPassportUpload = async (url, fileName, cb) => {
  try {
    // console.log(fileName,'--===[]');
    let formData = {
      file: await Promise.resolve(fs.createReadStream("uploads/" + fileName)),
    };
    request.post(
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhMjFkOTJlMi03M2IxLTQ1YzUtYTRjMS02ZWJkMDM5OGI5ZTciLCJ0eXBlIjoiYWNjZXNzIiwiZXhwIjoxODk2NDE1MzczLCJpYXQiOjE1ODEwNTUzNzMsIm5iZiI6MTU4MTA1NTM3MywiaWRlbnRpdHkiOiJkZXYudmFsdWVwaXRjaEBhYWRoYWFyYXBpLmlvIiwiZnJlc2giOmZhbHNlLCJ1c2VyX2NsYWltcyI6eyJzY29wZXMiOlsicmVhZCJdfX0.JLDtJskYbjJj7l4k_IwYcVYaaFuOk5uNWt9q3TrnPIk",
        },
        url: url,
        method: "POST",
        formData: formData,
      },
      function (err, httpResponse, body) {
        if (!err && httpResponse.statusCode === 200) {
          // console.log('Kya main yaha hoo?',body)
          cb(null, body);
        } else {
          console.log("==-==-err", err);
          cb(err, body);
        }
      }
    );
  } catch (err) {
    console.log("oouch", err);
    cb(err, null);
  }
};

//Function that generates otp
let makeotp = function () {
  let otp = Math.floor(Math.random() * (8888 - 1000 + 1)) + 1010;
  // console.log(otp);

  let otpmsg = "" + otp;
  return otpmsg;
};

//Scoreme
var requestapiPostt = async function (url, form, headers = {}, cb) {
  let formData = { ...form };
  let reqParams = {
    headers: { "content-type": "application/json", ...headers },
    url: url,
    method: "POST",
  };
  if (formData.type && formData.type.toLowerCase() == "json") {
    delete formData["type"];
    reqParams["json"] = formData;
  } else if (formData.type && formData.type.toLowerCase() == "formdata") {
    delete reqParams.formData["type"];
    reqParams["formData"] = formData;
  }
  request(reqParams, function (error, response, body) {
    if (error) {
      console.log("-------", error);
      cb(error, body);
    } else {
      cb(null, body);
    }
  });
};

var requestapiPostWithHeaders = function (url, header, data, cb) {
  request(
    {
      url: url,
      method: "POST",
      headers: header,
      json: data,
    },
    function (error, response, body) {
      if (error) {
        console.log("error:", error);
        cb(error, body);
      } else {
        // console.log(body);
        cb(null, body);
      }
    }
  );
};

let requestGet = async function (url, cb) {
  // console.log(url,'----====-----')
  let options = {
    url: url,
    method: "GET",
  };
  request(options, function (error, response, body) {
    // console.log(response,'=[][][][]')
    if (error) {
      console.log("-------", error);
      cb(error, body);
    } else {
      cb(null, body);
    }
  });
};

let requestGetNOEncode = async function (url, headers = {}, cb) {
  let reqParams = {
    headers: { ...headers },
    url: url,
    method: "GET",
    encoding: null,
  };

  request(reqParams, function (error, response, body) {
    if (error) {
      console.log("-------", error);
      cb(error, body);
    } else {
      cb(null, body);
    }
  });
};

async function base64_encode(fileName) {
  let buff = await Promise.resolve(fs.readFileSync("uploads/" + fileName));
  let base64data = await Promise.resolve(buff.toString("base64"));
  // console.log(base64data)
  return base64data;
}


// let requestData = async function (options) {
//   try {
//     let resData = await axios(options);
//     return resData;

//   } catch (error) {
//     // console.log('Error: ', error)
//     return error;
//   }
// }
// let timeoutFun = (ms) => {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

module.exports = {
  // timeoutFun,
  requestApiCreditReportPost,
  requestapiPostWithHeaders,
  isValidDate,
  convertToDate,
  convertToDateWithoutZone,
  convertToDateWith1day,
  getDateDiff,
  requestapiFaceMatchPost,
  checkToken,
  renameKeys,
  getUniversalCompletionTime,
  sort_by,
  makeotp,
  requestapiGet,
  requestapi,
  requestPassportUpload,
  requestapiPost,
  requestApiPost,
  requestApiUpload,
  requestApiUpload2,
  requestApiUpload3,
  requestApiUpload4,
  getWithParams,
  requestapiPostt,
  requestapiPostZoop,
  requestGet,
  requestGetNOEncode,
  requestapiSPost,
  // requestData
};
