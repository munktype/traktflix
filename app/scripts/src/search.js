'use strict';

var Request = require('./request.js');

function Search(options) {
  this.item = options.item;
  this.url = 'https://api-v2launch.trakt.tv/search';
  this.episodeUrl = 'https://api-v2launch.trakt.tv/shows';
};

Search.prototype = {
  getUrl: function() {
    return this.url + '?type=' + this.item.type + '&query=' + this.item.title;
  },

  getEpisodeUrl: function(item, slug) {
    return this.episodeUrl + '/' + slug + '/seasons/' + item.season
      + '/episodes/' + item.episode + '?extended=images';
  },

  findMovie: function(options) {
    Request.send({
      method: 'GET',
      url: this.getUrl(),
      success: function(response) {
        options.success.call(this, response[0]);
      },
      error: function(status, response) {
        options.error.call(this, status, response);
      }
    });
  },

  findEpisode: function(options) {
    Request.send({
      method: 'GET',
      url: this.getUrl(),
      success: function(response) {
        var data = JSON.parse(response)[0];

        Request.send({
          method: 'GET',
          url: this.getEpisodeUrl(item, data['show']['ids']['slug']),
          success: function(resp) {
            options.success.call(this, resp);
          },
          error: function(st, resp) {
            options.error.call(this, st, resp);
          }
        });
      },
      error: function(status, response) {
        options.error.call(this, status, response);
      }
    });
  }
}

module.exports = Search;