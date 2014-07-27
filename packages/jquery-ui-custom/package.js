Package.describe({
  summary: "Custom build of jQueryUI, wrapped in a package"
});

Package.on_use(function (api) {
  api.use('jquery', 'client');
  api.add_files('jquery-ui.min.js', 'client');
});