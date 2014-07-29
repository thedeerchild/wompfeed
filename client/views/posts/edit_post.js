Template.editPost.helpers({
  post: function() {
    return Posts.findOne(this._id);
  }
});

Template.editPost.rendered = function() {
  // window.editor = true;
}