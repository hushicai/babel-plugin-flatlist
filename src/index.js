// babel plugin

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

const VirtualizedListPath = 'react-native/Libraries/Lists/VirtualizedList';

module.exports = function({types: t}) {
  return {
    name: 'Rewrite React Native VirtualizedList perspective',
    visitor: {
      VariableDeclaration(path, state) {
        let filename = state.file.opts.filename;

        // unknown for test
        // VirtualizedList for release
        if (filename !== 'unknown' &&
         filename.lastIndexOf(VirtualizedListPath) === -1
        ) {
          return;
        }

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
          console.log('babel-plugin-flatlist found StyleSheet');
          console.log('babel-plugin-flatlist add perspective');

          // const Platform = require('Platform');
          path.insertBefore(
            t.variableDeclaration('const', [
              t.variableDeclarator(
                t.identifier('Platform'),
                t.callExpression(t.identifier('require'), [t.stringLiteral('Platform')])
              )
            ])
          );
          /**
           * const perspective = Platform.select({
           *   android: {perspective: 1},
           *   ios: null
           * });
           */
          path.insertBefore(
            t.variableDeclaration('const', [
              t.variableDeclarator(
                t.identifier('perspective'),
                t.callExpression(
                  t.memberExpression(
                    t.identifier('Platform'),
                    t.identifier('select')
                  ),
                  [
                    t.objectExpression([
                      t.objectProperty(
                        t.identifier('android'),
                        t.objectExpression([
                          t.objectProperty(t.identifier('perspective'), t.numericLiteral(1))
                        ])
                      ),
                      t.objectProperty(t.identifier('ios'), t.nullLiteral())
                    ])
                  ]
                )
              )
            ])
          );
          path.get('declarations.0.init').replaceWithSourceString(`
            StyleSheet.create({
                verticallyInverted: {
                  transform: [{scaleY: -1}, perspective].filter(Boolean),
                },
                horizontallyInverted: {
                  transform: [{scaleX: -1}, perspective].filter(Boolean),
                }
            })
          `);
        }
      }
    }
  };
};
