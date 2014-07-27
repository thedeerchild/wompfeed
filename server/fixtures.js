Meteor.startup(function () {
  Meteor.users.update({points:null},{$set:{points:100}});
  Meteor.users.update({id:"jgEGK66AkoECpRLiY"},{$set:{admin:true}});
});