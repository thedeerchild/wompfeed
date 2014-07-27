Template.home.helpers({
  users: function() {
    return Meteor.users.find();
  }
})