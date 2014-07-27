Template.editPostForm.rendered = function() {
  $('textarea:visible').expanding();
  window.editor = new Editor();

  if (typeof Session.get('editPost') !== 'object') {
    editor.init($('[data-editor]'));
  } else {
    editor.init($('[data-editor]'), Session.get('editPost'));
  }
};