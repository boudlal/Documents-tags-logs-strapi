module.exports = {
    routes: [
      { // Path defined with an URL parameter
        method: 'GET',
        path: '/documents/import', 
        handler: 'document.import',
      },
    ]
  }