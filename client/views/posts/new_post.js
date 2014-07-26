Template.newPost.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      title: $(e.target).find('[name=title]').val(),
      content: $(e.target).find('[name=content]').val(),
      anonymous: $(e.target).find('[name=anonymous]').is(':checked')    
    }

    Meteor.call('createPost', post, function(error, id) {
      if (error) {
        alert(error.reason);
      } else {
        Router.go('home');//, {_id: id});
      }
    });
  }
});