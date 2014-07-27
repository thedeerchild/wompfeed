var Editor = function() {
}
Editor.prototype = {
  init: function(elem) {
    // UI elements
    this.$container      = elem;
    this.$itemsContainer = elem.find('[data-editor-items]');
    this.$title          = elem.find('[data-editor-title]');
    this.$addButton  = elem.find('[data-editor-add]');

    this.lastSearch = '';

    // Components to be cloned
    this.components = {
      $dragHandle:  $('<span class="editor__handle" data-editor-handle></span>'),
      $deleteIcon:  $('<a href="#" class="editor__icon delete" data-editor-delete><img src="http://placehold.it/25x25" alt=""></a>'),
      $gifSearcher: $('<div class="gif-searcher"></div>')
        .append('<div class="gif-searcher__search"><p>Search for a GIF:</p><input type="text"></div>')
        .append('<div class="gif-searcher__results"><ul></ul></div>')
        .append('<div class="gif-searcher__show"><img></div>')
    }
    this.components.$contentItem = $('<div class="content-item"></div>')
      .append('<input type="text" class="content-item__title" placeholder="Add a title (optional)">')
      .append(this.components.$gifSearcher)
      .append('<textarea class="content-item__body" placeholder="Add text (optional)"></textarea>');

    // Add event listeners
    this.events();

    // FOR TESTING: add sample items
    this.addItem();
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
    })

    // Add text or image units when those buttons are clicked
    this.$addButton.click(function() {
      _this.addItem();
    });

    // Delete an item when that button is clicked
    this.$itemsContainer.on('click', '[data-editor-delete]', function() {
      _this.deleteItem($(this));
    });
  },
  addItem: function() {
    var $contentItem = this.components.$contentItem.clone();
    $contentItem
      .append(this.components.$deleteIcon.clone())
      .append(this.components.$dragHandle.clone())
      .appendTo(this.$itemsContainer)
      .hide(0)
      .slideDown(250);
    $contentItem.find('.content-item__text').expanding();
    new GIFSearcher($contentItem.find('.gif-searcher'), this);
  },
  deleteItem: function(elem) {
    elem.closest('.content-item').remove();
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
  this.showSearch();
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
            _this.editor.lastSearch = searchTerm;
          }
          else {
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

    this.views.image.children('img').attr('src', src);
  },

  getImages: function(query) {
    // Set a default
    if (typeof query === 'undefined') query = this.query || 'cats';
    // Encode it
    query = encodeURI(query);

    var queryURL = 'http://api.giphy.com/v1/gifs/search'
      , params   = {q: query, limit: 9, api_key: 'dc6zaTOxFJmzC'}

    var search = $.getJSON(queryURL, params);
    return search;
  }
}

Template.editPost.rendered = function() {
  var editor = new Editor();
  editor.init($('[data-editor]'));
};