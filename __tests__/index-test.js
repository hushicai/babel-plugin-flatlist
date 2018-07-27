const plugin = require('../');
const pluginTester = require('babel-plugin-tester');

const tests = [
  {
    title: 'both `StyleSheet.create` and `module.exports`',
    code: `
const styles = StyleSheet.create({
  verticallyInverted: {
    transform: [{scaleY: -1}],
  },
  horizontallyInverted: {
    transform: [{scaleX: -1}],
  },
});

module.exports = VirtualizedList;
`,
    snapshot: true
  },
  {
    title: 'both `StyleSheet.create` and `export default`',
    code: `
const styles = StyleSheet.create({
  verticallyInverted: {
    transform: [{scaleY: -1}],
  },
  horizontallyInverted: {
    transform: [{scaleX: -1}],
  },
});

export default VirtualizedList;
`,
    snapshot: true
  },
  {
    title: 'both `StyleSheet.create` and `module.exports`, but not sibling',
    code: `
const styles = StyleSheet.create({
  verticallyInverted: {
    transform: [{scaleY: -1}],
  },
  horizontallyInverted: {
    transform: [{scaleX: -1}],
  },
});

const a = 1;

module.exports = VirtualizedList;
`,
    snapshot: true
  },
  {
    title: 'only `StyleSheet.create`',
    code: `
const styles = StyleSheet.create({
  verticallyInverted: {
    transform: [{scaleY: -1}],
  },
  horizontallyInverted: {
    transform: [{scaleX: -1}],
  },
});
`,
    snapshot: true
  },
  {
    title: 'styles object and `module.exports`',
    code: `
const styles = {
  verticallyInverted: {
    transform: [{scaleY: -1}],
  },
  horizontallyInverted: {
    transform: [{scaleX: -1}],
  },
};

module.exports = VirtualizedList;
`,
    snapshot: true
  },
  {
    title: 'styles primitive and `module.exports`',
    code: `
const styles = 1;

module.exports = VirtualizedList;
`,
    snapshot: false
  }
];

pluginTester({
  plugin,
  tests
});
