## INSTALLATION

Exécuter `yarn install`

Créer une freshe base de données mysql `xyz`

Copier le content de`.env.example` à un new fichier`.env`

Modifier les informations de connexion à mysql Dans`.env`

## Importation des documents

Il y a 2 méthodes pour importer les documents et les tags.

### Méthode 1
Envoyer un GET requête à `http://.../api/documents/import`

### Méthode 2
Décommenter cette ligne `// strapi.services["api::document.document"].import();` dans `/src/index` 

### NOTE: les documents peuvent être importé seulement pour une seule fois.
