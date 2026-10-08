// Babel config used by Jest only for msw and its ESM-only dependencies.

// Jest runs these packages as CommonJS, where `import.meta` is unavailable.
function importMetaUrlToFilename({ template }) {
  const visitor = {
    MetaProperty(path) {
      const parent = path.parentPath;
      if (
        parent.isMemberExpression() &&
        parent.get("property").isIdentifier({ name: "url" })
      ) {
        parent.replaceWith(
          template.expression.ast`require("url").pathToFileURL(__filename).href`,
        );
      }
    },
  };
  // Run on Program entry so this happens before babel-preset-expo rejects import.meta.
  return {
    visitor: {
      Program(path) {
        path.traverse(visitor);
      },
    },
  };
}

module.exports = {
  presets: [require.resolve("expo/internal/babel-preset")],
  plugins: [
    importMetaUrlToFilename,
    "@babel/plugin-transform-class-static-block",
  ],
};
