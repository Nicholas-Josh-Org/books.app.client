'use strict';

var app = app || {};

const ENV = {};

ENV.isProduction = window.location.protocol === 'https:';
ENV.productionApiUrl = 'insert cloud API server URL here';
ENV.developmentApiUrl = 'http://localhost:3000';
ENV.apiUrl = ENV.isProduction ? ENV.productionApiUrl : ENV.developmentApiUrl;

(function(module) {
  function errorCallback(err) {
    console.error(err);
    module.errorView.initErrorPage(err);
  }
  
  function Book(rawBookObj) {
    Object.keys(rawBookObj).forEach(key => this[key] = rawBookObj[key]);
  }
  console.log('stuff');
  Book.prototype.toHtml = function() {
    let template = Handlebars.compile($('#book-list-template').text());
    return template(this);
  };

  Book.all = [];
  Book.loadAll = rows => Book.all = rows.sort((a, b) => b.title - a.title).map(book => new Book(book));

  Book.fetchAll = callback =>
    $.get(`${ENV.apiUrl}/api/v1/books`)
      .then(Book.loadAll).then(console.log('fetchAll'))
      .then(callback)
      .catch(errorCallback);


  // Book.loadOne = rows => Book.book_id = rows.map(book => new Book(book));



  Book.fetchOne = callback =>
    $.get(`${ENV.apiUrl}/api/v1/books/${callback}`)
      .then(app.oneView.render).then(console.log('fetchOne'))
      .then(callback)
      .catch(errorCallback);


  module.Book = Book;
})(app);
