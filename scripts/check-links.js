const fs = require('fs')
const path = require('path')

// Scans the client/ directory for occurrences of <Link ...><a
// Exits with code 0 if none found, 2 if matches found.

const root = path.resolve(__dirname, '..', 'client')
const matches = []

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const ent of entries) {
    const full = path.join(dir, ent.name)
    // skip node_modules and Next build output
    if (full.includes('node_modules') || full.includes('.next')) continue
    if (ent.isDirectory()) {
      scanDir(full)
    } else if (ent.isFile() && /\.jsx?$|\.tsx?$/.test(ent.name)) {
      const content = fs.readFileSync(full, 'utf8')
      const re = /<Link[^>]*>[\s\S]*?<a[\s\S]*?>/g
      if (re.test(content)) {
        matches.push(full)
      }
    }
  }
}

try {
  if (!fs.existsSync(root)) {
    console.error('client/ directory not found — skipping link check')
    process.exit(0)
  }
  scanDir(root)
  if (matches.length) {
    console.error('Invalid Link usage found in the following files:')
    for (const m of matches) console.error(' -', path.relative(process.cwd(), m))
    console.error('\nPlease remove nested <a> tags inside <Link> components or use <Link legacyBehavior> intentionally.')
    process.exit(2)
  } else {
    console.log('No invalid <Link> with <a> child patterns found in client/.')
    process.exit(0)
  }
} catch (err) {
  console.error('Error while scanning for Link usages:', err)
  process.exit(1)
}
