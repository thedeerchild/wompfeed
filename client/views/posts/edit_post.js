Template.editPost.rendered = function() {
  if (window.editor === undefined) {
    window.editor = new Editor();
  }
  editor.init($('[data-editor]'));
};