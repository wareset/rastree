// import { tokenize } from '../tokenize'
// import fs from 'fs'
// import path from 'path'

const { tokenize } = require('../dist')
const fs = require('fs')
const path = require('path')

const http = require('http')

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/plain')
  res.end('Hello World')
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)

  const dummy = (..._) => {}
  dummy(tokenize, fs, path)

  const DIR_SRC = path.resolve(__dirname, '../src')
  const readFile = (filename) =>
    fs.readFileSync(path.resolve(DIR_SRC, filename)).toString()

  dummy(readFile)

  const print = (arr) => {
    let res = ''
    arr.forEach((v, k, a) => {
      const str = 'DEEP: ' + v.deep + '   RAW:   ' + v.raw // + ' SE: ' + [v.start, v.end]
      if (a[k + 1] && v.end !== a[k + 1].start) throw new Error(str)
      // if (!v.raw.trim()) return
      // console.log(str)
      res += '\n' + str // JSON.stringify(v)
    })
    console.log(res)
    return res
  }
  dummy(print)

  // prettier-ignore
  const DIR_NODE_MODULES =
  path.resolve(__dirname, '../../../../../node_modules')

  console.log(DIR_NODE_MODULES)

  // const minCount = 84
  // const maxCount = 84

  const minCount = 251
  const maxCount = 251
  let counter = 0
  const findBuilders = (input = DIR_NODE_MODULES) => {
    if (++counter > maxCount) return
    // console.log('DIRECTORY: ' + input)

    const files = fs.readdirSync(input, { withFileTypes: true })

    // console.log(files)

    let name, filepath, content, tokens
    for (const dirent of files) {
      name = dirent.name
      filepath = path.resolve(input, name)
      if (dirent.isDirectory()) findBuilders(filepath)
      else if (dirent.isFile()) {
        if (/[jt]s/.test(path.extname(name))) {
          if (++counter > maxCount) {
            console.log('FINAL: ' + counter)
            return
          }
          if (counter < minCount) continue
          console.log('FILE: ' + filepath)
          content = fs.readFileSync(path.resolve(DIR_SRC, filepath)).toString()
          // console.log('\nCONTENT:')
          // console.log(content)
          console.log('TOKENIZE: ' + counter)
          tokens = tokenize(content)
          console.log(tokens[0])
          console.log(tokens[tokens.length - 1])
          console.log(tokens.length)
          // console.log(tokens)
          if (tokens.map((v) => v.raw).join('') !== content) {
            throw new Error(counter)
          }
          console.log('\n')
        }
      }
    }
  }

  // findBuilders()
  // ;(() => {
  //   const content = fs
  //     .readFileSync(path.resolve(__dirname, 'unicode.js'))
  //     .toString()

  //   // console.log(content)

  //   const tokens = tokenize(content)
  //   console.log(tokens)
  // })()
})
