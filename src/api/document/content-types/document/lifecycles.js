

module.exports = {
    async afterCreate() {
        try {
            await strapi.services["api::log.log"].track("Document", "insert");

        } catch (error) {
            console.log(error);
        }
    },

    async afterUpdate() {
        try {
            await strapi.services["api::log.log"].track("Document", "update");

        } catch (error) {
            console.log(error);
        }
    },

    async afterDelete() {
        try {
            await strapi.services["api::log.log"].track("Document", "delete");

        } catch (error) {
            console.log(error);
        }
    }
}