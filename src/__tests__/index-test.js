const plugin = require('../');
const pluginTester = require('babel-plugin-tester');

const tests = [
  {
    title: 'case 1',
    code: `;
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
    title: 'case 2',
    code: `
    module.exports = VirtualizedList;
`,
    snapshot: true,
    pluginOptions: { commonjs: true }
  },
  {
    title: 'case 3',
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
    title: 'case 4',
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
    title: 'case 5',
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
  }
];

pluginTester({
  plugin,
  tests
});
