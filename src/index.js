// babel plugin
// 解决inverted FlatList在emui 5.0/android 7.0上失效问题
// @see: https://github.com/facebook/react-native/pull/14646?from=timeline&isappinstalled=0

const isVirtualizedListModuleExports = (t, node) => {
  return (
    t.isExpressionStatement(node) &&
    t.isAssignmentExpression(node.expression) &&
    t.isMemberExpression(node.expression.left) &&
    t.isIdentifier(node.expression.left.object, {name: 'module'}) &&
    t.isIdentifier(node.expression.left.property, {name: 'exports'}) &&
    t.isIdentifier(node.expression.right, {name: 'VirtualizedList'})
  );
};

const isStylesIdentifier = (t, node) => {
  return t.isIdentifier(node, {name: 'styles'});
};

const isStyleSheetCreateCallExpression = (t, node) => {
  let callee = node.callee;

  return (
    t.isMemberExpression(callee) &&
    t.isIdentifier(callee.object, {name: 'StyleSheet'}) &&
    t.isIdentifier(callee.property, {name: 'create'})
  );
};

module.exports = function({types: t}) {
  return {
    name: 'Rewrite VirtualizedList perspective',
    visitor: {
      VariableDeclaration(path, state) {
        let sibling = path.getNextSibling().node;

        if (!isVirtualizedListModuleExports(t, sibling)) {
          return;
        }

        let node = path.node;
        let declaration = node.declarations[0];

        if (
          t.isVariableDeclarator(declaration) &&
          isStylesIdentifier(t, declaration.id) &&
          isStyleSheetCreateCallExpression(t, declaration.init)
        ) {
          return path.get('declarations.0.init').replaceWithSourceString(`
             StyleSheet.create({
              verticallyInverted: {
                transform: [{scaleY: -1, perspective: 1}],
              },
              horizontallyInverted: {
                transform: [{scaleX: -1, perspective: 1}],
              },
            })
          `);
        }
      }
    }
  };
};
