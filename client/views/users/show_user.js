Template.showUser.helpers({
  user: function() {
    return Meteor.users.findOne(Session.get('profileUser'),
      {fields:{
        '_id': true,
        'profile.name': true,
        'services.twitter.screenName': true, 
        'services.twitter.profile_image_url': true
      }});
  },
  posts: function() {
    return Posts.find({userId: this._id, anonymous: false})
  },
  postsCount: function() {
    var count = Posts.find({userId: this._id, anonymous: false}).count();
    return  count + (count === 1 ? ' post' : ' posts');
  },
  profileImage: function() {
    console.log('HELPER:',this);
    var usr = Meteor.users.findOne(this._id);
    if (usr)
      return this.services.twitter.profile_image_url.replace('_normal','');
  }
})