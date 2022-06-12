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
            let already_imported = await strapi.db.connection("configs").select('value').where({ key: 'already_imported' });
            
            if (Array.isArray(already_imported) && already_imported[0] && already_imported[0].value == "true") {
                return {success: false, message: "already granted"}
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
            
            await strapi.db.connection("configs").transacting(trx).insert({key: "already_imported", value: "true"});
    
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
    },

    async updatePermissions() {
        // console.log('----start updatePermissions');
        let trx = await strapi.db.connection.transaction();
        try {
            let already_permissions_granted = await strapi.db.connection("configs").select('value')
            .where({ key: 'already_permissions_granted' });
            if (Array.isArray(already_permissions_granted) && already_permissions_granted[0] && already_permissions_granted[0].value == "true") {
                return {success: false, message: "already granted"}
            } 


            if (already_permissions_granted && already_permissions_granted.value == "true") {
                return {success: false, message: "Permissions already granted"}
            }

            let permissions_payload = [
                {"action": "api::document.document.find"},
                {"action": "api::document.document.findOne"},
                {"action": "api::document.document.create"},
                {"action": "api::document.document.update"},
                {"action": "api::document.document.delete"},
                {"action": "api::document.document.import"},
                {"action": "api::tag.tag.find"},
                {"action": "api::tag.tag.findOne"},
                {"action": "api::tag.tag.create"},
                {"action": "api::tag.tag.update"},
                {"action": "api::tag.tag.delete"},
            ]

            let first_id = await strapi.db.connection("up_permissions").transacting(trx).insert(permissions_payload)    
            first_id = first_id[0]

            let permissions_roles_links_payload = [];

            for (let i = 0; i < permissions_payload.length; i++) {
                permissions_roles_links_payload.push({role_id: 2, permission_id: i+first_id })
            }

            await strapi.db.connection("up_permissions_role_links").transacting(trx).insert(permissions_roles_links_payload)    
            
            await strapi.db.connection("configs").transacting(trx).insert({key: "already_permissions_granted", value: "true"});

            // Commit transaction
            await trx.commit();
    
            console.log("Successfully granted")
            return {success: true, message: "Successfully granted"}
    
    
        } catch (error) {
            console.log('-----error', error);
            // Rollback transaction
            await trx.rollback()
            return {success: false, message: "Internal server error"}
        }
    }
}));



