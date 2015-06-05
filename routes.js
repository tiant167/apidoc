var doc = require('./app/controllers/doc');

module.exports = function(app){
  app.param('id', doc.load);
  app.get('/doc/new', doc.newView);
  app.post('/doc/new', doc.create);
  app.get('/doc/edit/:id', doc.updateView);
  app.post('/doc/edit/:id', doc.update);
  app.get('/doc/list', doc.list);
  app.get('/doc/:id', doc.showView);
  app.get('/', doc.list);
};