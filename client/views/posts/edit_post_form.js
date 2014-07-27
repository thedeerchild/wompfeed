Template.editPostForm.rendered = function() {
  $('textarea:visible').expanding();
  window.editor = new Editor();

  if (Session.get('editPost')) {
    editor.init($('[data-editor]'));
  } else {
    editor.init($('[data-editor]'), Session.get('editPost'));
  }
};