Package.describe({
  summary: "Geoff and Michael's fancy-schmancey editor, wrapped in a package"
});

Package.on_use(function (api) {
  api.add_files('lib/handlebars.min.js', 'client');
  api.add_files('editor.js', 'client');

  api.export('Handlebars', 'client');
  api.export('Editor', 'client');
});