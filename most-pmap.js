"use strict"
var most= require( "most")
var create= require( "@most/create").create
var pmap= require( "most-promise-map")

function noop(){console.log("noop")}

function mostPMap(fn, stream, parallel){
	parallel= parallel|| 1

	var _add= noop, _end
	var output= create(function( add, end){
		if( _end){
			end( _end)
			return
		}
		_add= add
		_end= end
	})

	var capacity= new Array(parallel)
	for( var i= 0; i< parallel.length; ++i){
		capacity.push(0)
	}
	var gate= most.from( capacity).concat( output)

	stream
	.zip(x=> x, gate)
	// map is just here--
	.map(function(x){
		return Promise
			.resolve( x)
			.then(function(x){
				return fn( x)
			})
			.then( _add)
			.catch(function(){})
	})
	// --to be waited on--
	.awaitPromises()
	.drain()
	// --so we know when all processing is really done & can close
	.then(function(){
		if( _end){
			_end()
		}else{
			_end= true
		}
	})

	return output
}

module.exports= mostPMap
