;(function() {

Editor = function() {}

Editor.prototype = {
  init: function(elem, data) {
    // UI elements
    this.$container      = elem;
    this.$itemsContainer = elem.find('[data-editor-items]');
    this.$title          = elem.find('[data-editor-title]');
    this.$addButton      = elem.find('[data-editor-add]');
    this.$publishButton  = elem.find('[data-editor-publish]');

    this.lastSearch = '';

    // Content item template
    var template = $('#content-template').html();
    this.contentItem = Handlebars.compile(template);

    // Add event listeners
    this.events();

    if (typeof data === 'object') {
      this.deserialize(data);
    }
    else {
      this.addItem();
    }
  },
  events: function() {
    var _this = this;

    // Make each item sortable
    this.$itemsContainer.sortable({
      handle: '[data-editor-handle]',
      placeholder: 'editor__placeholder'
    });

    // Block carriage returns on title editor, blur the field instead
    this.$title.on('keypress', function(event) {
      if (event.which === 13) {
        $(this).blur();
      }
    });

    // Add text or image units when those buttons are clicked
    this.$addButton.click(function() {
      _this.addItem();
    });

    // Delete an item when that button is clicked
    this.$itemsContainer.on('click', '[data-editor-delete]', function() {
      _this.deleteItem($(this));
    });

    // Serialize and save when publish button is clicked
    this.$publishButton.click(function() {
      _this.save();
      return false;
    })
  },
  addItem: function(data) {
    var $contentItem = $(this.contentItem(data || {}));
    $contentItem
      .appendTo(this.$itemsContainer)
      .hide(0)
      .slideDown(250);
    new GIFSearcher($contentItem.find('.gif-searcher'), this);

    this.$container.find('.content-item__body').on('keypress', function(event) {
      if (event.which == 46) {
        var content = this.textContent;
        var request = $.getJSON('http://guarded-caverns-4613.herokuapp.com/ner', {text: content});
        request.done(function(data) {
          console.log(data);
        });
      }
    });
  },
  deleteItem: function(elem) {
    elem.closest('.content-item').remove();
  },
  serialize: function() {
    var json = [];
    this.$itemsContainer.find('.content-item').each(function() {
      json.push({
        'title': $(this).find('.content-item__title').val(),
        'image': $(this).find('.gif-searcher__show > img').attr('src'),
        'body': $(this).find('.content-item__body').val()
      });
    });

    console.log(json);
    return json;
  },
  save: function() {
    // SAVE HEYA
    return this.serialize();
  },
  deserialize: function(data) {
    var _this = this;

    $.each(data, function(index, item) {
      _this.addItem(item);
    });
  }
}

var GIFSearcher = function($elem, editor) {
  this.$container = $elem;

  this.views = {
    search:  this.$container.children('.gif-searcher__search'),
    results: this.$container.children('.gif-searcher__results'),
    image:   this.$container.children('.gif-searcher__show')
  }
  this.query = '';

  this.editor = editor;

  this.events();

  if (typeof this.views.search.children('img').attr('src') === 'undefined') {
    this.showSearch();
  }
  else {
    this.showImage();
  }
}
GIFSearcher.prototype = {
  events: function() {
    var _this = this;

    this.views.search.children('input').on('keypress', function(event) {
      if (event.which !== 13) return;

      var searchTerm = this.value;
      var search = _this.getImages(searchTerm);
      search
        .done(function(data, textStatus, jqxhr) {
          if (data.data.length === 0) {
            _this.views.search.append('<p>Couldn\'t find any images :( Try again?');
          }
          else {
            _this.editor.lastSearch = searchTerm;
            _this.showResults(data);
          }
        })
        .fail(function(jqxhr, textStatus, error) {
          console.log(textStatus+', '+error);
        });
    });

    this.views.results.on('click', 'li', function() {
      var src = $(this).children('img').attr('src');
      _this.showImage(src);
    });
  },

  showSearch: function() {
    this.views.search.show();
    this.views.results.hide();
    this.views.image.hide();

    if (this.editor.lastSearch) {
      this.views.search.children('input').val(this.editor.lastSearch);
    }
  },
  showResults: function(data) {
    var _this = this;

    this.views.search.hide();
    this.views.results.show();
    this.views.image.hide();

    // If there's no data, do a search for some
    if (typeof data === 'undefined') {

    }
    else {
      var $container = this.views.results.children('ul').eq(0);
      $.each(data.data, function(i, image) {
        var $item = $('<li><img src="'+image.images.original.url+'"></li>');
        $container.append($item);
      });
    }
  },
  showImage: function(src) {
    this.views.search.hide();
    this.views.results.hide();
    this.views.image.show();

    if (typeof src !== 'undefined') {
      this.views.image.children('img').attr('src', src);
    }
  },

  getImages: function(query) {
    // Set a default
    if (typeof query === 'undefined' || query == '') query = this.query || 'cats';
    // Encode it
    query = encodeURI(query.replace(" ","+"));

    var queryURL = 'http://api.giphy.com/v1/gifs/search'
      , params   = {q: query, limit: 9, api_key: 'dc6zaTOxFJmzC'}

    var search = $.getJSON(queryURL, params);
    return search;
  }
}

})();