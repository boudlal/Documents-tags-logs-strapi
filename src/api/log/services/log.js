'use strict';

/**
 * log service.
 */
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::log.log', ({strapi}) => ({
    async track(entityName, action) {
        if (!entityName || !action) return;
        
        try {
            await strapi.db.query("api::log.log").create({
                data: {
                    EntityName: entityName,
                    action,
                    loggedAt: new Date()
                }
            })

            return;
        } catch(e) {
            console.log(e);
        }
    }
})

);
