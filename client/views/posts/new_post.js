Template.newPost.events({
  'click .submit-form': function(e) {
    e.preventDefault();

    var post = {
      title: $('[name=title]').text(),
      introText: $('[name=introText]').val(),
      content: window.editor.save(),
      anonymous: $('[name=anonymous]').is(':checked')    
    }

    Meteor.call('createPost', post, function(error, id) {
      if (error) {
        alert(error.reason);
      } else {
        Session.set('postFirstView', id);
        Router.go('showPost', {_id: id});
      }
    });
  }
});