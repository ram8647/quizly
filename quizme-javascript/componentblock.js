/* Copyright 2012 Massachusetts Institute of Technology. All rights reserved. */

/**
 * @fileoverview Generating JavaScript for component-related blocks.
 *
 * Code generation for component-related blocks works a little differently than for built-in
 * blocks. 
 * 
 * @author ralph.morelli@trincoll.edu (Ralph Morelli)
 */

/**
 * Returns a function that takes no arguments, generates JavaScript for an event handler declaration block
 * and returns the generated code string.
 *
 * @returns null
 */
Blockly.JavaScript.event = function() {
  console.log('Generating event code for ' + this.type);
  var funcName = this.instanceName + this.eventName;
  var body = '';
  for (var i = 0; i < this.childBlocks_.length; i++) {
    body += Blockly.JavaScript.blockToCode(this.childBlocks_[i]);
  }
  var code = 'function ' + funcName + '(){\n' + body + '}\n';
  code = Blockly.JavaScript.scrub_(this, code);
  Blockly.JavaScript.definitions_[funcName] = code;
  return null;
}

/**
 * Return a variable assignment statement using the Component's name and
 *  property as a compound global variable name.
 *
 */
Blockly.JavaScript.setter = function() {
  console.log('Generating setter code for ' + this.type);
  var propName = this.getTitleValue("PROP");                    // e.g. Text
  var compName = this.getTitleValue("COMPONENT_SELECTOR");   // e.g., Label1
  var varName = "global_" + compName + propName;
  var value = Blockly.JavaScript.blockToCode(this.childBlocks_[0]);
  var code = varName + ' = ' + value[0] + ';\n';     // e.g., Label1Text
  return code;
}

/**
 * Generates code for color blocks
 *
 */
Blockly.JavaScript.color_block = function() {
  console.log('Generating setter code for ' + this.type);
  var code = -1 * (window.Math.pow(16,6) - window.parseInt("0x" + this.getTitleValue('COLOR').substr(1)));
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
}

