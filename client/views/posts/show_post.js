Template.showPost.helpers({
  shareUrl: function() {
    return Meteor.absoluteUrl().slice(0,-1) + Router.routes['showPost'].path({_id: this._id});
  },
  authorUrl: function() {
    return Router.routes['showUser'].path({_id: this.userId});
  },
  ownsPost: function() {
    return ownsDoc(Meteor.userId(), this);
  }
});