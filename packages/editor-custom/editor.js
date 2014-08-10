;(function() {

Editor = function() {}

Editor.prototype = {
  init: function(elem, data) {
    // UI elements
    this.$container      = elem;
    this.$itemsContainer = elem.find('[data-editor-items]');
    this.$title          = elem.find('[data-editor-title]');
    this.$subtitle       = elem.find('[data-editor-subtitle]');
    this.$hero_image     = elem.find('[hero-background]');
    this.$hero_gif_search= elem.find('[hero-gif-search]');
    this.$addButton      = elem.find('[data-editor-add]');

    this.lastSearch = '';

    // Content item template
    var template = $('#content-template').html();
    this.contentItem = Handlebars.compile(template);

    // Add event listeners
    this.events();

    if (typeof data === 'object') {
      console.log(data);
      this.deserialize(data);
    }
    else {
        // add gif searcher
        var $contentItem = $(this.contentItem(data || {}));
        $contentItem.find('.gif-searcher').clone().appendTo(this.$hero_gif_search);
        this.$hero_gif_search.find('.gif-searcher__search > input').attr('placeholder', "Add a header GIF");
        var gif_searcher = new GIFSearcher(this.$hero_gif_search.find('.gif-searcher'), this);
        var _this = this;
        gif_searcher.showImage = function(src) {
            gif_searcher.views.search.hide();
            gif_searcher.views.results.hide();
            gif_searcher.views.image.hide();

            if (typeof src !== 'undefined') {
                _this.$hero_image.attr('src', src);
            }
        };
      // this.addItem();
    }
  },
  events: function() {
    var _this = this;

    // Make each item sortable
    // this.$itemsContainer.sortable({
    //   handle: '[data-editor-handle]',
    //   placeholder: 'editor__placeholder'
    // });

    // Block carriage returns on title editor, blur the field instead
    this.$container.on('keypress', '[data-editor-title], .content-item__title', function(event) {
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

  },
  addItem: function(data) {
    var _this = this;
    var $contentItem = $(this.contentItem(data || {}));
    $contentItem
      .appendTo(this.$itemsContainer)
      .hide(0)
      .slideDown(250);
    var gif_searcher = new GIFSearcher($contentItem.find('.gif-searcher'), this);

    if (data) {
        $contentItem.find('.content-item__title').val(data.title)
        $contentItem.find('.content-item__body').val(data.body)
            if (data.image)
                gif_searcher.showImage(data.image);

    }

    this.$itemsContainer.sortable({
      handle: '[data-editor-handle]',
      placeholder: 'editor__placeholder'
    });

    $('textarea:visible').expanding();

    cb_suggest = function(event) {
        if (event.which == '.'.charCodeAt(0) || event.which == '?'.charCodeAt(0) || event.which == "!".charCodeAt(0) || event.which == " ".charCodeAt(0)) {
            var content = $contentItem.find('.content-item__title').val() + ' . ' + $contentItem.find('.content-item__body').val();
            var request = $.getJSON('http://guarded-caverns-4613.herokuapp.com/ner', {text: content});
            request.done(function(data) {
                    var ul = $contentItem.find('.gif-searcher__suggest > ul');
                    ul.empty();
                    $.each(data.best_guess, function(index, item) {
                            var list_item = $('<li>'+item+'</li>');
                            ul.append(list_item);
                            list_item.click(function() {
                                    gif_searcher.getImages(item)
                            });
                    });
                });
        }};
     $contentItem.find('.content-item__body').on('keypress', cb_suggest);
     $contentItem.find('.content-item__title').on('keypress', cb_suggest);
  },
  deleteItem: function(elem) {
    elem.closest('.content-item').slideUp(400, function(){
      $(this).remove();
    });
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

    return json;
  },
  save: function() {
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
    image:   this.$container.children('.gif-searcher__show'),
    suggest: this.$container.children('.gif-searcher__suggest')
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
    });

    this.views.results.on('click', 'li', function() {
      var src = $(this).children('img').attr('src');
      _this.showImage(src);
    });

    this.views.image.find('.delete').click(function() {
      _this.views.image.children('img').attr('src', '');
      _this.showSearch();
    });

    this.views.results.on('click', '.again', function() {
      _this.showSearch();
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
      $container.empty();
      $.each(data.data, function(i, image) {
        var $item = $('<li><img src="'+image.images.original.url+'"></li>');
        $container.append($item);
      });
      // $container.masonry({itemSelector: 'li'});
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
        var _this = this;
        fn = function() {
            // Set a default
            if (typeof query === 'undefined' || query == '') query = this.query || 'cats';
            // Encode it
            query = encodeURI(query.replace(" ","+"));
            
            var queryURL = 'http://api.giphy.com/v1/gifs/search'
            , params   = {q: query, limit: 48, api_key: 'dc6zaTOxFJmzC'}
            
            var search = $.getJSON(queryURL, params);
            return search;
        }().done(function(data, textStatus, jqxhr) {
                if (data.data.length === 0) {
                    _this.views.search.append('<p>Couldn\'t find any images :( Try again?');
                }
                else {
                    _this.editor.lastSearch = query;
                    _this.showResults(data);
                }
            })
        .fail(function(jqxhr, textStatus, error) {
                console.log(textStatus+', '+error);
            });
  }
}

})();