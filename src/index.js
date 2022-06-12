'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {

    /**
     * CUSTOM NOTE!!!
     * data populations in rest is not working properly when disabling the auth in the routes
     * CHECK ISSUE: https://github.com/strapi/strapi/issues/12226
     * so we give public permissions manually to our relations (Documents and tags)
    */
    strapi.services["api::document.document"].updatePermissions();
    // strapi.services["api::document.document"].import();
  },
};
