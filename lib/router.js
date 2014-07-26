Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function(){
  this.route('home', {
    path: '/'
  });

  this.route('newPost', {
    path: '/p/new'
  })
});