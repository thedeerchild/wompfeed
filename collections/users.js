if (Meteor.isServer) {
  Accounts.onCreateUser(function(options, user) {
    user.profile = {name: options.profile.name};
    user.points = 100;
    return user
  });
}
