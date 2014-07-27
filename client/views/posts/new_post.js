Template.newPost.events({
  'click .submit-form': function(e) {
    e.preventDefault();

    var post = {
      title: $('[name=title]').val(),
      content: window.editor.save(),
      anonymous: $('[name=anonymous]').is(':checked')    
    }

    Meteor.call('createPost', post, function(error, id) {
      if (error) {
        alert(error.reason);
      } else {
        Router.go('showPost', {_id: id});
      }
    });
  }
});