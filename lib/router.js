Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map(function(){
  this.route('home', {
    path: '/'
  });

  this.route('newPost', {
    path: '/p/new'
  });

  this.route('showPost', {
    path: '/p/:_id',
    data: function() {
      return Posts.findOne(this.params._id);
    }
  });

  this.route('showUser', {
    path: '/u/:_id',
    data: function() {
      return Meteor.users.findOne(this.params._id);
    }
  });
});

var requireLogin = function(pause) {
  if (! Meteor.user()) {
    if (Meteor.loggingIn())
      this.render(this.loadingTemplate);
    else
      // zTODO: Handle this better
      this.redirect('home');
    pause();
  }
}

Router.onBeforeAction(requireLogin, {only: 'newPost'});