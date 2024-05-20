/* global phantom */

const system = require('system')
const page = require('webpage').create()
const url = system.args[1]

page.onLoadFinished = function () {
  setTimeout(function () {
    console.log(page.content)
    phantom.exit()
  }, 1000)
}

page.open(url, function () {
  page.evaluate(function () {
  })
})
