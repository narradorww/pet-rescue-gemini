'use strict'

var REGEX = /Chrome\/\d\d?.\d.\d/

module.exports = function (agent) {
  if (!agent) return null

  var match = REGEX.exec(agent)
  if (!match) return null

  var parts = parseInt(match[0].split('Chrome/')[1], 0)

  return parts
}
