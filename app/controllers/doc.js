/* 
* @Author: chaihaotian
* @Date:   2015-06-02 19:01:23
* @Last Modified by:   chaihaotian
* @Last Modified time: 2015-06-06 00:39:25
*/

'use strict';
var mongoose = require('mongoose')
var extend = require('util')._extend
var path = require('path')
var Doc = mongoose.model('Doc')

// app.param, get specific doc by id
exports.load = function(req, res, next, id){
  Doc.findById(id, function(err, doc){
    if (err) return next(err);
    if (!doc) return next(new Error('not found'));
    req.doc = doc;
    next();
  })
};

// render single doc page
exports.showView = function(req, res, next){
  var htmlPath = path.resolve(__dirname, '../../public/html/' + req.doc._id +'.html');
  res.sendFile(htmlPath);
};

// add doc View
exports.newView = function(req, res){
  res.render('doc/new', { title: 'Create New Doc', doc: new Doc()});
};

// update doc View
exports.updateView = function(req, res){
  res.render('doc/new', { title: 'Edit Doc', doc: req.doc})
}

// update view
exports.update = function(req, res){
  var doc = req.doc;
  doc = extend(doc, req.body);
  doc.save(function(err){
    if (!err){
      return res.redirect('/doc/' + doc._id);
    }
    return res.render('doc/new', { title: 'Edit Doc', doc: doc});
  });
}

// add logic
exports.create = function(req, res){
  var doc = new Doc(req.body);
  doc.save(function(err){
    if (!err){
      return res.redirect('/doc/' + doc._id);
    }
    return res.render('doc/new', { title: 'Edit Doc', doc: doc});
  });
};

// list
exports.list = function(req, res, next){
  Doc.find({}, function(err, docs){
    res.render('doc/index', { title: 'Docs List', docs: docs});
  })
};
