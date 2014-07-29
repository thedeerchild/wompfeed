Meteor.publish('posts', function(options) {
  return Posts.find(options);
});

Meteor.publish('singlePost', function(id) {
  return id && Posts.find({_id:id});
});

var userProfileData = {
    '_id': true,
    'points': true,
    'profile.name': true,
    'services.twitter.screenName': true, 
    'services.twitter.profile_image_url': true,
    'admin': true
  }

Meteor.publish(null, function() {
  return Meteor.users.find({_id: this.userId}, {fields:userProfileData});
});

Meteor.publish('singleUser', function(id) {
  return id && Meteor.users.find(id, {fields: userProfileData});
});