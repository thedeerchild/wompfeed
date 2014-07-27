if (Meteor.isServer) {
  Accounts.onCreateUser(function(options, user) {
    user.points = 100;
    return user
  });
}
