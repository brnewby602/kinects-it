const logger = require('../config/logger.js');
const db = require('../db.js');
const request = require('request');
const hardware = require('../../config.js');

exports.getDevices = (req, res, next) => {
  const homeId = req.params.id;
  logger.info('HomeId in getDevices: ', homeId);

  db.query('SELECT ${column^} FROM ${table~} where houseId=${home}', {
    column: '*',
    table: 'devices',
    home: homeId,
  })
  .then((result) => {
    logger.info('SUCCESS in getDevices: ', result);
    res.send(result);
  })
  .catch((error) => {
    logger.info('ERROR in getDevices: ', error);
    res.send(error);
  })
  .finally(() => {
    next();
  });
};


exports.addDevice = (req, res) => {
  const deviceId = req.params.deviceId;

  const options = { method: 'POST',
    url: `https://api-http.littlebitscloud.cc/devices/${deviceId}/output`,
    headers: {
      authorization: `Bearer ${hardware.ACCESS_TOKEN}`,
      'content-type': 'application/json',
      accept: 'application/vnd.littlebits.v2+json',
    },
    body: { duration_ms: 100 },
    json: true };

  request(options, (error) => {
    if (error) throw new Error(error);
  });

  return res.json({ success: true });
};

