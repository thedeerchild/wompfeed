Template.showPost.helpers({
  shareUrl: function() {
    return Meteor.absoluteUrl().slice(0,-1) + Router.routes['showPost'].path({_id: this._id});
  },
  authorUrl: function() {
    return Router.routes['showUser'].path({_id: this.userId});
  },
  ownsPost: function() {
    return ownsDoc(Meteor.userId(), this) || Meteor.user().admin;
  }
});

Template.showPost.rendered = function() {
  $('.congrats').hide()
  if (!!Session.get('postFirstView')) {
    Meteor.setTimeout(function(){
      $('.congrats').fadeIn('slow');
    }, 500);

  }
}