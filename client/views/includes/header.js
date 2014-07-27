Template.header.events({
  'click .sign-in': function(e) {
    e.preventDefault();
    
    Meteor.loginWithTwitter(function(){
      Router.go('home');
    });
  }
})