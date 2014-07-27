Template.editPost.rendered = function() {
  $('textarea:visible').expanding();

  if (window.editor === undefined) {
    window.editor = new Editor();
  }
  editor.init($('[data-editor]'));
};