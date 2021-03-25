const https = require('https');
const http = require('http');

const Request = function(options, opt){
  this.adapter = opt?.ssl ? https : http;
  this.options = options;
}

Request.prototype.send = function(data, callback) {
  const req = this.adapter.request(this.options, res => {
    console.log(`HTTPS statusCode: ${res.statusCode}`)

    res.on('data', data => {
      console.log(data)
    })
    res.on('end', () => {
      callback(res)
    })
  })

  req.on('error', error => {
    console.error('HTTPS ERROR: ', error)
  })

  req.write(data)
  req.end()
}

Request.prototype.sendAsync = function(data) {
  return new Promise((resolve, reject) => {
    const req = this.adapter.request(this.options, res => {
      let rawData;

      res.setEncoding('utf8');
      res.on('data', chunk => {
        rawData = chunk;
      })

      res.on('end', () => {
        console.log('requested data: ', `[${res.statusCode}] - `, rawData)
        resolve(JSON.parse(rawData))
      })
    })

    req.on('error', error => {
      reject(error)
    })

    req.write(JSON.stringify(data))
    req.end()
  })
}



export default Request;
