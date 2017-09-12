"use strict"
var most= require("most")
var create= require("@most/create").create

function noop(){}

function mostPMap(fn, stream, parallel){
	parallel= parallel|| 1
	var initial= stream.take( parallel).map( fn).awaitPromises()
	var skip= stream.skip( parallel)
	var more= create(function( add, end){
		var more= skip.zip( function( element){
			return fn( element)
		// create is lazy so output is now initialized
		}, output).awaitPromises().forEach( add).then(end)
	})
	//var output= initial.join( more)
	var output= most.join(most.from([initial, more]))
	return output
}

module.exports= mostPMap
