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

  this.route('logIn', {
    path: '/login',
    template: 'accessDenied'
  })

  this.route('me', {
    path: '/me',
    waitOn: function() {
      return [
                Meteor.subscribe('posts', {userId: Meteor.userId()}),
                Meteor.subscribe('singleUser', Meteor.userId())
              ];
    },
    data: function() {
      return Meteor.users.findOne(Meteor.userId());
    },
    action : function () {
       if (this.ready()) this.render();
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
    },
    action: function() {
      if (this.ready()) {
        if (!!Posts.findOne(this.params._id)) {
          this.render();
        } else {
          this.redirect('home');
        }
      }
    }
  });

  this.route('editPost', {
    path: '/p/:_id/edit',
    waitOn: function() {
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() {
      return Posts.findOne(this.params._id);
    },
    action : function () {
       if (this.ready()) {
        Session.set('editPost', Posts.findOne(this.params._id).content);
        this.render();
      }
    }
  });

  this.route('showUser', {
    path: '/u/:_id',
    waitOn: function() {
      return [Meteor.subscribe('singleUser', this.params._id), Meteor.subscribe('posts', {userId: this.params._id})];
    },
    data: function() {
      return Meteor.users.findOne(this.params._id);
    },
    action : function () {
       if (this.ready()) this.render();
    }
  });
});

var requireLogin = function(pause) {
  if (! Meteor.user()) {
    if (Meteor.loggingIn())
      this.render(this.loadingTemplate);
    else
      this.redirect('home');
    pause();
  }
}

Router.onBeforeAction(requireLogin, {only: ['me', 'newPost']});