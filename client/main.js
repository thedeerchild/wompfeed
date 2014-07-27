Template.home.helpers({
  users: function() {
    return Meteor.users.find();
  }
})

try{Typekit.load();}catch(e){}