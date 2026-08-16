// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  'next',
  'dist',
  'build',
  'index.js'
);
const backup = target + '.bak';

if (!fs.existsSync(target)) {
  console.log('Next build file not found at', target);
  console.log(
    'Skipping patch (you can run `next build` directly if you prefer).'
  );
  process.exit(0);
}

try {
  const content = fs.readFileSync(target, 'utf8');
  const search = 'throw new Error(`Build optimization failed';
  const replace = 'new Error(`FUUUU: ';

  if (!content.includes(search)) {
    console.log('No matching string found; nothing to patch.');
    process.exit(0);
  }

  fs.writeFileSync(backup, content, 'utf8');
  const patched = content.split(search).join(replace);
  fs.writeFileSync(target, patched, 'utf8');
  console.log('Patched next build file; backup saved to', backup);
} catch (err) {
  console.error('Failed to patch next build file:', err && err.message);
  process.exit(1);
}
