/**
 * @file Centerialized event emitter.
 * @author AtlasDev
 * @copyright Dany Sluijk 2015
 */

var events = require('events');

var EventEmitter = new events.EventEmitter();

module.exports = EventEmitter;
