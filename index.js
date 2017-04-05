const deasync = require('deasync');

function warn(warning) {
  warning = Boolean(warning);
  if (warning) {
    console.warn('load config from consul ignored.');
  }
}

function loadConsulConfig(opts) {
  var config = opts.config;
  const path = opts.path;
  const warning = opts.warning === undefined ? true : opts.warning;

  if (!config || !path) {
    warn(warning);
    return;
  }
  if (!config.consul) {
    warn(warning);
    return;
  }

  const promisify = config.consul.promisify;
  config.consul.promisify = false;

  const consul = require('consul')(config.consul);
  config.consul.promisify = promisify;

  function bindConsulConfig(path, cb) {
    consul.kv.get(path, function(err, data) {
      if (err) {
        warn(warning);
        console.error('get consul config error:', err);
      }

      if (data && data.Value) {
        try {
          const value = JSON.parse(data.Value);
          config = config.util.extendDeep(config, value);
        } catch (e) {
          warn(warning);
          console.error(`parse consul config failed: error: ${e}, orginalData: ${JSON.stringify(data)}`);
        }
      }

      return cb(null);
    });
  }
  const bindIt = deasync(bindConsulConfig);
  bindIt.call(this, path);
}

module.exports = loadConsulConfig;
