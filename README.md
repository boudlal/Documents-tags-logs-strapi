## INSTALLATION

Exécutez `yarn install`

Créez une freshe base de données MySQL `xyz`

Copiez le contenu de`.env.example` dans un nouveau fichier`.env`

Modifiez les informations de la base de données MySQL dans `.env`

Exécutez `npm run start`

## Importation des documents

Il y a 2 méthodes pour importer les documents et les tags.

### Méthode 1
Envoyez un GET requête à `http://.../api/documents/import`

### Méthode 2
Décommentez cette ligne `// strapi.services["api::document.document"].import();` dans `/src/index.js` 

### NOTE: Les documents ne peuvent être importés qu'une seule fois.
