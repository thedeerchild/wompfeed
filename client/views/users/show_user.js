Template.showUser.helpers({
  posts: function() {
    return Posts.find({userId: this._id, anonymous: false})
  }
})