const path = require('path');
const { gitDescribeSync } = require('git-describe');
const { version } = require('./package.json');
const { resolve, relative } = require('path');
const fs = require('fs');

const gitInfo = gitDescribeSync({
  dirtyMark: false,
  dirtySemver: false
});

console.log('\nRunning pre-build tasks - retrieving version info');

const versionFile = path.join(__dirname + '/src/environments/version.ts');

gitInfo.version = version;
const src = `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
export const version = ${JSON.stringify(gitInfo, null, 4)};
/* tslint:enable */
`;

fs.writeFileSync(
  versionFile,
  src, { encoding: 'utf-8' });

console.log('Wrote version info', `${gitInfo.version}`, `into ${relative(resolve(__dirname, '..'), versionFile)}`);
console.log('End of pre-build tasks - retrieving version info');
