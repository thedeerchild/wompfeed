Template.editPostForm.helpers({
  titleText: function() {
    var post = Posts.findOne(this._id);
    if (!!post) {
      return post.title;
    } else {
      return 'Click to Add Title'
    }
  },
  headerImageUrl: function() {
    var post = Posts.findOne(this._id);
    if (!!post) {
      return post.headerImage;
    } else {
      return 'http://placehold.it/500x500&text=%20'
    }
  }
});

Template.editPostForm.rendered = function() {
  $('textarea:visible').expanding();
  window.editor = new Editor();

  if (typeof Session.get('editPost') !== 'object') {
    editor.init($('[data-editor]'));
  } else {
    editor.init($('[data-editor]'), Session.get('editPost'));
  }
};