Template.home.helpers({
  users: function() {
    return Meteor.users.find();
  }
});

Template.home.events({
  'click .sign-in': function(e) {
    e.preventDefault();
    
    Meteor.loginWithTwitter();
  }
})

try{Typekit.load();}catch(e){}