"use strict"
var most= require("most")

function mostPMap(input, fn, parallel){
	parallel= parallel|| 1
	var initial= input.take( parallel).map( fn).awaitPromises()
	var more= input.skip( parallel).zip( function(input){
		return fn( input)
	}, output)).awaitPromises()
	var output= initial.join(more)
	return output
}
