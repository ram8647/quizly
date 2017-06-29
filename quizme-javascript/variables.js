/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating JavaScript for variable blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

// Global variable definition block                                                                                                                                                                         
Blockly.JavaScript.global_declaration = function() {
  var name = this.getTitleValue('NAME');
  var argument0 = Blockly.JavaScript.valueToCode(this, 'VALUE', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  return 'global_' + name + ' = ' + argument0 + ';\n';
};

Blockly.JavaScript.lexical_variable_get = function() {
  // Variable getter.
  var code = Blockly.JavaScript.variableDB_.getName(this.getTitleValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript.lexical_variable_set = function() {
  // Variable setter.
  var argument0 = Blockly.JavaScript.valueToCode(this, 'VALUE',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.JavaScript.variableDB_.getName(
      this.getTitleValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + ';\n';
};

Blockly.JavaScript.local_declaration_statement = function() {
  return Blockly.JavaScript.local_variable(this,false);
}

Blockly.JavaScript.local_declaration_expression = function() {
  return Blockly.JavaScript.local_variable(this,true);
}

/**
 * Generates code for either the local_declaration_statement and
 *  local_declaration_expression blocks.  These blocks have different
 *  forms:
 *
 *  declaraction_statement :  initialize local <name> to <expr> in do <stack>
 *  delcaration_expression :  initialize local <name> to <expr> in return <r-expr>
 *
 * NOTE: For the expression case, the statement that would go in the <stack>
 *  may be located in blocks that are within the return <r-expr>.  We use
 *  an anonymous function to handle this case.  The generated code becomes:
 *
 *   function(<name>) { return <r-expr> ; }(<expr>)
 */
Blockly.JavaScript.local_variable = function(block, isExpression) {
  var args = [];
  var values = [];
  var code = "";

  // Store variable names and values in arrays
  for (i = 0; block.getTitleValue('VAR' + i); i++) {
    args.push(block.getTitleValue("VAR" + i));
    values.push(Blockly.JavaScript.valueToCode(block,'DECL' + i, Blockly.JavaScript.ORDER_ASSIGNMENT) || '0');
  }


  // For expressions, generate an anonymous function with variables as parameters,
  //  followed by a function call with initial values as arguments.
  if (isExpression) {
    code = 'function(' + args + ') {\n';
    code += '    return ' + Blockly.JavaScript.valueToCode(block, 'RETURN', Blockly.JavaScript.ORDER_NONE) || '';
    code += ';\n  }(' + values + ')';
  } else {
    for (var j=0; j < args.length; j++) {
      code += 'var ' + args[j] + ' = ' + values[j] + ";\n";
    }
    code += Blockly.JavaScript.statementToCode(block, 'STACK');
    if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
      code = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + code;
    }
  }
  
  // Expressions return an array
  if (isExpression) {
    return [code, Blockly.JavaScript.ORDER_ANONYMOUS_FUNCTION ];
  } else {
    return code;
  }
};

