Template.postItem.helpers({
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

Template.postItem.events({
  'click .makePublic': function() {
    Posts.update({_id:this._id}, {$set:{anonymous:false}});
  },
  'click .makeAnonymous': function() {
    Posts.update({_id:this._id}, {$set:{anonymous:true}});
  }
});