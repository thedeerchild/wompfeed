Template.editPost.helpers({
  post: function() {
    return Posts.findOne(this._id);
  }
});

Template.editPost.events({
  'click .submit-form': function(e, t) {
    e.preventDefault();

    var post = {
      _id: t.data._id,
      title: $('[name=title]').text(),
      headerImage: $('[hero-background]').attr('src'),
      introText: $('[name=introText]').val(),
      content: window.editor.save(),
      anonymous: $('[name=anonymous]').is(':checked')    
    }

    Meteor.call('editPost', post, function(error, id) {
      if (error) {
        alert(error.reason);
      } else {
        Router.go('showPost', {_id: id});
      }
    });
  }
});

Template.editPost.rendered = function() {
  // window.editor = true;
}