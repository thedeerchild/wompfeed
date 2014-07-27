Meteor.startup(function () {
  Meteor.users.update({points:null},{$set:{points:100}});
});