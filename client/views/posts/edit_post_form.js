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

  if (!!this.data) {
    editor.init($('[data-editor]'), this.data.content);
  } else {
    editor.init($('[data-editor]'));
  }
};