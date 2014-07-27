Template.showPost.helpers({
  author: function() {
    if (this.anonymous) {
      return 'Anonymous'
    } else {
      return Meteor.users.findOne(this.userId).profile.name;
    }
  },
  authorUrl: function() {
    return Router.routes['showUser'].path({_id: this.userId});
  },
  ownsPost: function() {
    return ownsDoc(Meteor.userId(), this);
  }
});