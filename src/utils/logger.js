const isProd = process.env.NODE_ENV === 'production';

const logger = {
  log: (...args) => {
    if (!isProd) console.log(...args);
  },

  info: (...args) => {
    if (!isProd) console.info(...args);
  },

  warn: (...args) => {
    console.warn(...args);
  },

  error: (...args) => {
    console.error(...args);
  }
};

module.exports = logger;