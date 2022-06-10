

module.exports = {
    async afterCreate() {
        try {
            await strapi.services["api::log.log"].track("Tag", "insert");

        } catch (error) {
            console.log(error);
        }
    },

    async afterUpdate() {
        try {
            await strapi.services["api::log.log"].track("Tag", "update");

        } catch (error) {
            console.log(error);
        }
    },

    async afterDelete() {
        try {
            await strapi.services["api::log.log"].track("Tag", "delete");

        } catch (error) {
            console.log(error);
        }
    }
}