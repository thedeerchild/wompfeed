Template.showPost.helpers({
  authorUrl: function() {
    return Router.routes['showUser'].path({_id: this.userId});
  },
  ownsPost: function() {
    return ownsDoc(Meteor.userId(), this);
  }
});