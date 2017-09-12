#!/usr/bin/env node
"use strict"
var
  leftPad= require("left-pad"),
  most= require("most"),
  mostPmap= require("..")

var i = 0
function delay( ms){
	var id= i++
	console.log( "start", leftPad(id, 2), leftPad( ms, 5), new Date().toISOString())
	return new Promise(function( resolve){
		setTimeout(function(){
			resolve({ ms, id, date: new Date().toISOString()})
		}, ms)
	})
}

var delays= most.from([2000, 2000, 500, 500, 1000, 5000, 5000, 1000, 4000])
var mapped= mostPmap(delay, delays, 3)

mapped.forEach(x=> console.log( "end  ", leftPad( x.id, 2), leftPad(x.ms, 5), x.date))
