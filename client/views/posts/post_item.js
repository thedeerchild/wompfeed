Template.postItem.helpers({
  authorUrl: function() {
    return Router.routes['showUser'].path({_id: this.userId});
  }
})