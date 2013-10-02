/* Copyright 2012 Massachusetts Institute of Technology. All rights reserved. */

/**
 * @fileoverview Generating JavaScript for component-related blocks.
 *
 * Code generation for component-related blocks works a little differently than for built-in
 * blocks. 
 * 
 * @author ralph.morelli@trincoll.edu (Ralph Morelli)
 */

Blockly.JavaScript = Blockly.Generator.get('JavaScript');

/**
 * Returns a function that takes no arguments, generates JavaScript for an event handler declaration block
 * and returns the generated code string.
 *
 * @param {String} instanceName the block's instance name, e.g., Button1
 * @param {String} eventName  the type of event, e.g., Click
 * @returns {Function} event code generation function with instanceName and eventName bound in
 */
Blockly.JavaScript.event = function() {
  console.log('Generating event code for ' + this.instanceName);
  var funcName = this.instanceName + this.eventType.name;
  var body = '';
  for (var i = 0; i < this.childBlocks_.length; i++) {
    body += Blockly.JavaScript.blockToCode(this.childBlocks_[i]);
  }
  var code = 'function ' + funcName + '(){\n' + body + '}\n';
  code = Blockly.JavaScript.scrub_(this, code);
  Blockly.JavaScript.definitions_[funcName] = code;
  return null;
}

