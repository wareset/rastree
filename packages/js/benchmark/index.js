const fse = require('fs-extra')
const path = require('path')
const http = require('http')
const assert = require('assert').strict

const HOSTNAME = '127.0.0.1'
const PORT = 3000
const exec = require('util').promisify(require('child_process').exec)

const rastree = require('../dist').default

console.log(fse)

const stringly = JSON.stringify

const DIR_EXAMPLES = path.resolve(__dirname, 'examples')

// console.log(DIR_EXAMPLES)

// prettier-ignore
const PACKAGES = {
  'acorn': 'https://github.com/acornjs/acorn.git',
  'espree': 'https://github.com/eslint/espree.git',
  'esprima': 'https://github.com/jquery/esprima.git',
  'shift-parser-js': 'https://github.com/shapesecurity/shift-parser-js.git',
  'test262-parser-tests': 'https://github.com/tc39/test262-parser-tests.git'
}

http
  .createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hello World')
  })
  .listen(PORT, HOSTNAME, async () => {
    console.clear()

    /* init */
    await fse.ensureDir(DIR_EXAMPLES)

    for await (const name of Object.keys(PACKAGES)) {
      const http = PACKAGES[name]
      if (!(await fse.exists(path.resolve(DIR_EXAMPLES, name)))) {
        console.log(name, http)

        await exec(`git clone ${http}`, {
          stdio: ['ignore', 'inherit', 'inherit'],
          cwd: DIR_EXAMPLES,
          shell: true
        })
      }
    }

    await (async () => {
      const DIR_TEST = path.resolve(DIR_EXAMPLES, 'esprima', 'test')
      if (!(await fse.exists(DIR_TEST))) return
      console.log('Test esprima tokenize')
      const esprima = require('esprima')
      // console.log(esprima)

      const DIR_3RDPARTY = path.resolve(DIR_TEST, '3rdparty')

      const files = (await fse.readdir(DIR_3RDPARTY, { withFileTypes: true }))
        .filter((v) => v.isFile())
        .map((v) => v.name)

      console.log(files)

      let i = 0
      for await (const name of files) {
        if (++i > 10) break
        const content = (
          await fse.readFile(path.resolve(DIR_3RDPARTY, name))
        ).toString()
        console.log([name, content.length])

        // prettier-ignore
        let tokensRastree = 1, tokensEsprima = 1

        console.time('tokensRastree')
        // const tokensRastree = rastree.tokenize('let   a \n\n= 112')
        tokensRastree = rastree
          .tokenize(content)
          .filter((v) => v.raw.trim() && v.type !== 'Comment')
        // .map((v) => v.loc)
        console.log('tokensRastree')
        console.log(+tokensRastree)
        console.timeEnd('tokensRastree')

        console.time('tokensEsprima')
        tokensEsprima = esprima.tokenize(content, {
          range: true,
          loc: true
        })
        // .map((v) => v.loc)
        console.log('tokensEsprima')
        console.log(+tokensEsprima)
        console.timeEnd('tokensEsprima')

        tokensEsprima.forEach((v, k) => {
          if (stringly(v.loc) !== stringly(tokensRastree[k].loc)) {
            console.log(k)
            console.log(tokensRastree[k])
            console.log(v)
            throw new Error()
          }
        })
      }
    })()

    console.log('RUN')
  })
