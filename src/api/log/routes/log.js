'use strict';

/**
 * log router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::log.log', {
    config: {
      find: {
        auth: false
      },
      findOne: {
        auth: false
      },
      create: {
        auth: false
      },
      update: {
        auth: false
      },
      delete: {
        auth: false
      },
    }
});
