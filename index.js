/* eslint-disable no-async-promise-executor */
/* eslint-disable no-continue */
import fs from 'fs'
import path from 'path'
import { PythonShell } from 'python-shell'

/**
 * getNewestFile function for get newes file in path
 * @param {string} dir is variable for set path dir
 * @param {string} regexp is variable for regex get specifiec new file
 * @returns
 */
const getNewestFile = (dir, regexp) => {
  let newest = null
  const files = fs.readdirSync(dir)
  let oneMatched = 0

  for (let i = 0; i < files.length; i++) {
    if (regexp.test(files[i]) === false) continue
    else if (oneMatched === 0) {
      newest = files[i]
      oneMatched = 1
      continue
    }

    const f1Time = fs.statSync(dir + files[i]).mtime.getTime()
    const f2Time = fs.statSync(dir + newest).mtime.getTime()
    if (f1Time > f2Time) { newest[i] = files[i] }
  }

  if (newest != null) { return (dir + newest) }
  return null
}

/**
 * sum function for sum data with specific key
 * @param {object} data is variable for to be sum
 * @param {string} key is variable for key want to be sum
 * @returns
 */
const sum = (data, key) => data.reduce((a, b) => a + (b[key] || 0), 0)

/**
 * delay function for create delay event block
 * @param {int} t is variable miliseconds
 * @param {*} val
 * @returns
 */
const delay = (t, val) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(val)
  }, t)
})

/**
 * Paginate is function for paginate data
 * @param {object} data is variable for data to be paginate
 * @param {int} fetch is variable for get fetch data
 * @returns to be [ [data1], [data2], [data3] ]
 */
const pagination = (data, fetch) => data.reduce((resultArray, item, index) => {
  const chunkIndex = Math.floor(index / fetch)

  if (!resultArray[chunkIndex]) {
    // eslint-disable-next-line no-param-reassign
    resultArray[chunkIndex] = [] // start a new chunk
  }

  resultArray[chunkIndex].push(item)

  return resultArray
}, [])

/**
 * deleteLogFile function for automate delete log file in path
 */
const deleteLogFile = (directory) => {
  console.log('Run Delete Log File')
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.log(err)
    }
    files.sort((a, b) => {
      if (a > b) {
        return -1
      }
      if (b > a) {
        return 1
      }
      return 0
    })
    const temp = files.slice(0, 3)
    // eslint-disable-next-line array-callback-return
    files.filter((e) => {
      if (!temp.includes(e)) { fs.unlinkSync(path.join(directory, e)) }
    })
  })
}

/**
 * runPy function for run script python
 * @param {string} filepath is variable for set path file
 * @param {string} filename is variable for set fielanem
 * @param {object array} args is variable for passing arguments
 * @returns resolve true
 */
const runPy = (filepath, filename, args) => new Promise(async (resolve, reject) => {
  try {
    const options = {
      args,
    }
    await PythonShell.run(path.join(filepath, filename), options, (err, result) => {
      if (err) {
        throw err
      } else { resolve(result) }
    })
  } catch (error) {
    reject(error)
  }
})

/**
 * mkdirp is function for create directory
 * @param {string} directory is variable for set directory path
 */
const mkdirp = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdir(directory, (err) => {
      if (err) { throw new Error(`Could not create ${directory}`) }
    })
  }
}

export default {
  getNewestFile,
  sum,
  delay,
  deleteLogFile,
  pagination,
  runPy,
  mkdirp,
}
