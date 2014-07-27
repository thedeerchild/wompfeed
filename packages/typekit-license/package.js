Package.describe({
  summary: "Typekit license file, wrapped in a package"
});

Package.on_use(function (api) {
  api.add_files('typekit.js', 'client');
});