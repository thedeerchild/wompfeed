Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map(function(){
  this.route('home', {
    path: '/',
    waitOn: function() {
      return Meteor.subscribe('posts', {});
    }
  });

  this.route('me', {
    path: '/me',
    waitOn: function() {
      return Meteor.subscribe('posts', {userId: Meteor.userId()});
    }
  });

  this.route('newPost', {
    path: '/p/new'
  });

  this.route('showPost', {
    path: '/p/:_id',
    waitOn: function() {
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() {
      return Posts.findOne(this.params._id);
    }
  });

  this.route('showUser', {
    path: '/u/:_id',
    waitOn: function() {
      return Meteor.subscribe('posts', {userId: this.params._id, anonymous: false});
    },
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

Router.onBeforeAction(requireLogin, {only: ['me', 'newPost']});