'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

  function  $Promise (executor) {

    if (!executor ) {
        throw new TypeError('executor must be function')
    }

    this._state = 'pending';

    //Cap 2 
    this._handlerGroups = [];
    
    
    executor(this._internalResolve.bind(this), this._internalReject.bind(this)); // forsamos a que se ejecute en el contexto de la promesa
    
 } 

 $Promise.prototype._internalResolve = function(someData) {

    let handler;

    if( this ._state === 'pending' ) {

        this ._state = 'fulfilled';
        this ._value = someData;

        while(this._handlerGroups.length ){
            handler = this._handlerGroups.shift(); // saca el primer elemento de []
            handler.successCb && handler.successCb(this._value);
        }
        
    }

 };

 $Promise.prototype._internalReject = function(someData) {

    let handler;
    
    if( this ._state === 'pending' ) {

        this ._state = 'rejected';
        this ._value = someData;

        while(this._handlerGroups.length ) {
            handler = this._handlerGroups.shift(); // saca el primer elemento de []
            handler.errorCb && handler.errorCb(this._value);
        }
    }
};

$Promise.prototype.then = function(successCb, errorCb) {

    // const downstreamPromise = new $Promise( (suc, err) => {
        
    // });
            if(this._state === 'fulfilled') {
                successCb && successCb(this._value)
            } else if(this._state === 'rejected') {
                errorCb && errorCb(this._value)
            }
            else  {
                this._handlerGroups.push({
                    successCb:  typeof successCb === 'function' ? successCb : false,
                    errorCb:    typeof errorCb === 'function' ? errorCb : false
                });
            }
    
 };

 $Promise.prototype.catch = function(errorCb) {

    this.then(null, errorCb)

 }


module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
