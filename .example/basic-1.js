#!/usr/bin/env node
"use strict"
var
  leftPad= require("left-pad"),
  most= require("most"),
  mostPmap= require("..")

var i = 0
function delay( ms){
	var id= i++
	return new Promise(function( resolve){
		setTimeout(function(){
			resolve( ms)
		}, ms)
	})
}

var delays= most.from([100, 100, 1500, 3000, 300, 100, 100, 100, 800, 2000, 1000, 200])
var mapped= mostPmap(delay, delays, 2)

mapped.forEach(x=> console.log( leftPad( x, 5, 0), new Date().toISOString()))
