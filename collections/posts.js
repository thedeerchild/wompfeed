Posts = new Meteor.Collection('posts');

Meteor.methods({
  createPost: function(postAttrs) {
    var user = Meteor.user();
    
    if (!user)
      throw new Meteor.Error(401, "You need to login to post new stories");

    if (!postAttrs.title)
      throw new Meteor.Error(422, 'Please fill in a headline');

    if (!postAttrs.content || postAttrs.content.length < 1)
      throw new Meteor.Error(422, 'Please fill in some content');

    var post = _.extend(_.pick(postAttrs, 'title', 'content', 'anonymous'), {
      userId: user._id,
      author: user.profile.name,
      submitted: new Date().getTime()
    });

    Meteor.users.update(user._id, {$inc:{points:50}})

    var postId = Posts.insert(post);

    return postId;
  }
});