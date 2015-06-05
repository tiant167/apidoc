var mongoose = require('mongoose');
var aglio = require('aglio');
var fs = require('fs');
var path = require('path');
var jsdom = require('jsdom');
var Schema = mongoose.Schema;

var DocSchema = new Schema({
  title: {type: String, trim: true, required: true, unique: true},
  content: {type: String, required: true},
  abstract: String
});

DocSchema.post('save', function(doc){
  aglio.render(doc.content, 'default', function (err, html, warnings) {
    if (err) throw err;
    // add nav bar using jsdom
    jsdom.env(html, [], function(errors, window){
      var parentNode = window.document.getElementsByTagName('body')[0]
      var firstChildNode = parentNode.firstChild
      var insertNode = window.document.createElement('div');
      insertNode.innerHTML = '<nav class="navbar navbar-inverse navbar-fixed-top">\
          <div class="container-fluid">\
            <div class="navbar-header">\
              <a class="navbar-brand" href="#">Api Docs</a>\
            </div>\
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">\
              <ul class="nav navbar-nav">\
                <li><a href="/doc/new">Create New Doc</a></li>\
                <li><a href="/doc/list">Doc List</a></li>\
              </ul>\
            </div>\
          </div>\
        </nav>'
      parentNode.insertBefore(insertNode, firstChildNode);
      window.document.getElementById('nav').style.marginTop = '78px';
      window.document.getElementsByClassName('col-md-8')[0].style.marginTop = '40px';
      // 去掉 google api fonts 的请求
      // 把美腻的roboto去掉真是痛心疾首…所以我准备把它放到本地来！
      // 别的两个 CDN 巨慢，也放本地
      // js 也是，都放本地
      window.document.getElementsByTagName('link')[0].href='/css/bootstrap.min.css'
      window.document.getElementsByTagName('link')[1].href='/css/font-awesome.min.css'
      window.document.getElementsByTagName('link')[2].href='/css/googlefont.css?family=Roboto:400,700|Inconsolata|Raleway:200'
      window.document.getElementsByTagName('script')[0].src='/js/jquery.min.js'
      window.document.getElementsByTagName('script')[1].src='/js/bootstrap.min.js'
      html = window.document.getElementsByTagName('html')[0].outerHTML
      // write html to file
      var filePath = path.resolve(__dirname, '../../public/html/' + doc._id + '.html')
      fs.writeFile(filePath, html, function (e) {
        if (e) throw e;
      });
    })
  });
});
mongoose.model('Doc', DocSchema);