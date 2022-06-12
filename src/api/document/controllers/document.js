'use strict';

/**
 *  document controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::document.document', ({strapi}) => ({
    async import(ctx) {
        let result = await strapi.service('api::document.document').import()
        // console.log('---result', result);
        ctx.send(result);
    }
})
);
