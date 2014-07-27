Posts = new Meteor.Collection('posts');

Meteor.methods({
  createPost: function(postAttrs) {
    var user = Meteor.user();
    
    if (!user)
      throw new Meteor.Error(401, "You need to login to post new stories");

    if (!postAttrs.title)
      throw new Meteor.Error(422, 'Please fill in a headline');

    var post = _.extend(_.pick(postAttrs, 'title', 'headerImage', 'introText', 'content', 'anonymous'), {
      userId: user._id,
      author: user.profile.name,
      submitted: new Date().getTime()
    });

    Meteor.users.update(user._id, {$inc:{points:50}})

    var postId = Posts.insert(post);

    return postId;
  }
});