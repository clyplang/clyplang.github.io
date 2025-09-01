const { highlightClyp, EXAMPLES } = require('./src/utils/clyp-highlighter');
const out = highlightClyp(EXAMPLES.hello_world.code);
console.log(out);
