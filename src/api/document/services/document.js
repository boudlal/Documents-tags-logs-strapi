'use strict';

/**
 * document service.
 */
const path = require('path');
const csv=require('csvtojson');
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::document.document', ({strapi}) => ({
    async import() {
        console.log('----start importing');
        let trx = await strapi.db.connection.transaction();
        try {
            let already_imported = await strapi.db.query("api::config.config").findOne({key: "already_imported"});
            if (already_imported && already_imported.value == "true") {
                return {success: false, message: "Documents already imported"}
            }

            let dir = path.resolve(__dirname, '../../../../test-back-documents.csv')
            let documents = await csv().fromFile(dir);
    
            let logged_at = new Date();
            let logs = [];
            let tags = [];
            
            for (let i = 0; i < documents.length; i++) {
                tags = tags.concat(documents[i].tags.split(","))
            }
    
            // Remove duplication
            tags = [...new Set(tags)];
    
            // Insert Tags 
            let result = await strapi.db.connection("tags").transacting(trx).insert(tags.map(x => ({name: x, created_at: logged_at, updated_at: logged_at})))
            let first_tag_id = result[0];
    
            // Map tag name to inseted id
            let tags_name_to_id = {}
            for (let i = 0; i < tags.length; i++) {
                tags_name_to_id[tags[i]] = first_tag_id + i
                logs.push({entity_name: "Tag", action: "insert", logged_at})
            }
    
    
            let document_tag_entries = [];
            documents = documents.map(x => {
                x.tags = [...new Set(x.tags.split(","))].map(y => {
                    document_tag_entries.push({document_id: x.id, tag_id: tags_name_to_id[y]})
                    return tags_name_to_id[y]
                })                
    
                logs.push({entity_name: "Document", action: "insert", logged_at})
    
                return {
                    id: x.id,
                    name: x.name,
                    created_at: x.created_at,
                    updated_at: x.updated_at
                };
            })
    
            await strapi.db.connection("documents").transacting(trx).insert(documents)    
    
            await strapi.db.connection("documents_tags_links").transacting(trx).insert(document_tag_entries)
    
            await strapi.db.connection("logs").transacting(trx).insert(logs);
            
            await strapi.db.connection("config").transacting(trx).insert({key: "already_imported", value: "true"});
    
            // Commit transaction
            await trx.commit();
    
            console.log("Successfully imported")
            return {success: true, message: "Successfully imported"}
    
    
        } catch (error) {
            console.log('-----error', error);
            // Rollback transaction
            await trx.rollback()
            return {success: false, message: "Internal server error"}
        }
    }
}));



