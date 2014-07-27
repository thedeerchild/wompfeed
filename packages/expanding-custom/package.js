Package.describe({
  summary: "Expanding textarea script, wrapped in a package"
});

Package.on_use(function (api) {
  api.use('jquery', 'client');
  api.add_files('expanding.js', 'client');
});