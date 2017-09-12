"use strict"
var most= require( "most")
var create= require( "@most/create").create
var pmap= require( "most-promise-map")
var Proxy = require( "most-proxy").proxy

var _skip= {}

function mostPMap(fn, stream, parallel){
	parallel= parallel|| 1

	var proxy= Proxy()
	var capacity= new Array(parallel)
	for( var i= 0; i< parallel; ++i){
		capacity[ i]= 1
	}
	var gate= most.from( capacity).concat( proxy.stream)

	var output= stream
	.zip(x=> x, gate)
	.map(function(x){
		return Promise
			.resolve( x)
			.then(function(x){
				return fn( x)
			})
			.catch(function(){
				return _skip
			})
	})
	.awaitPromises()
	.multicast()

	proxy.attach(output)
	return output.filter( x=> x!== _skip)
}

module.exports= mostPMap
