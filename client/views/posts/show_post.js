Template.showPost.helpers({
  shareUrl: function() {
    return Meteor.absoluteUrl().slice(0,-1) + Router.routes['showPost'].path({_id: this._id});
  },
  authorUrl: function() {
    return Router.routes['showUser'].path({_id: this.userId});
  },
  ownsPost: function() {
    if (!!Meteor.user())
      return ownsDoc(Meteor.userId(), this) || (!!Meteor.user().admin && Meteor.user().admin);
  }
});

Template.showPost.events({
  'click .delete-post': function(e,t) {
    if (confirm('Are you sure you want to delete this post?')) {
      Posts.remove(t.data._id);
      Router.go('home');
    }
  }
})

Template.showPost.rendered = function() {
  $('.congrats').hide()
  if (window.location.hash === '#first-view') {
    Meteor.setTimeout(function(){
      Router.go(window.location.href.split('#')[0]);
      $('.congrats').fadeIn('slow');
    }, 500);

  }
}