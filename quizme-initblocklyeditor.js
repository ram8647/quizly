/**
 * Quiz app based on Blockly (http://code.google.com/p/blockly/), which is
 * developed by Neil Fraser (fraser@google.com).  

 * Copyright 2012 R. Morelli
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
 * @fileoverview Initializes the blocklyeditor for quizme app.
 * @author ram8647@gmail.com (Ralph Morelli)
 */

//goog.require('Blockly.BlocklyEditor');

var DEBUG = GLOBAL_DEBUG;  // GLOBAL_DEBUG set in blockly.html

// ***************** Utility functions moved from index.html **************

// NOTE: Blockly injects a static toolbox in the form of an Xml tree. We want our toolbox to be dynamic but 
//  we must initialize it here. The TOOLBOX category serves as a static heading for the toolbox.
// This is the onload fuction that is  called from blockly.html when blockly is loaded into the iframe.

function initBlocklyFrame(quizdata) {
  var href = window.parent.document.location.href;  // Check parent window?
  if (href.indexOf('quizly') == -1) {
    href = window.document.location.href;           // Check this window
  }
  var quizname;
  var arglist = href.split('?')[1];
  if (arglist) {
    var params = arglist.split('&');
    for (var i = 0; i < params.length; i++) {
       var keyval = params[i].split('=');
       if (keyval[0] == 'quizname')
         quizname = keyval[1];
    }
  }

  if (DEBUG) console.log('RAM: initBlocklyFrame arglist = ' + arglist);

  // Typeblocking configuration
  var typeblock_config = {
    frame: 'ai_frame',
    typeBlockDiv: 'ai_type_block',
    inputText: 'ac_input_text'
  };

  Blockly.inject(document.body,
    {path: './',
       backpack:true,
       trashcan: true,
       toolbox: '<xml id="toolbox" style="display:none"><category name="TOOLBOX"><block type="bogus"></block></category></xml>'
    });

  if (DEBUG) console.log('RAM: initBlocklyFrame after inject ');

   //This is what Blockly's init function does when passing options.
   //We are overriding the init process so putting it here
   goog.mixin(Blockly, {
      collapse : true,
      configForTypeBlock: typeblock_config
    });

  if (DEBUG) console.log('RAM: initBlocklyFrame after goog.mixin ');

   //This would also be done in Blockly init, but we need to do it here because of
   //the different init process in drawer (it'd be undefined at the time it hits
   //init in Blockly)


   if (!Blockly.readOnly)
     Blockly['TypeBlock'](Blockly.configForTypeBlock);

   // Let the top-level application know that Blockly is ready.
   // Do any Quizme initializations here.
   window.parent['blocklyLoaded'](Blockly);

  if (DEBUG) console.log('RAM: initBlocklyFrame after TypeBlock ');

   if (window.parent.document.title == "Quiz Maker Utility")
     initQuizMaker('./');
   else 
     initQuizme(quizname, './', arglist, quizdata);
}

window['initBlocklyFrame'] = initBlocklyFrame;


if (!Blockly.BlocklyEditor) 
  Blockly.BlocklyEditor = {};

/**
 *  Modified from blocklyeditor.js.  Customized to use Toolbox instead of Drawer
 *   and to initialize editor and drop down menu.
 */
Blockly.BlocklyEditor.startquizme = function() {
  //  Blockly.inject(documentBody);
  //  Blockly.Drawer.createDom();
  //  Blockly.Drawer.init();
  //  Blockly.BlocklyEditor.formName_ = formName;
  
  // Save the Blockly.Blocks. This is used in quizme-helper to construct subsets of
  //  the language for particular quizzes.
  Blockly.WholeLanguage = Blockly.Blocks;  // Blockly.Blocks used to be Blockly.Language

  /* [Added by paulmw in patch 15]
  There are three ways that you can change how lexical variables 
  are handled:

  1. Show prefixes to users, and separate namespace in yail
  Blockly.showPrefixToUser = true;
  Blockly.usePrefixInYail = true;

  2. Show prefixes to users, lexical variables share namespace yail
  Blockly.showPrefixToUser = true;
  Blockly.usePrefixInYail = false;

  3. Hide prefixes from users, lexical variables share namespace yail
  //The default (as of 12/21/12)
  Blockly.showPrefixToUser = false;
  Blockly.usePrefixInYail = false;

  It is not possible to hide the prefix and have separate namespaces
  because Blockly does not allow to items in a list to have the same name
  (plus it would be confusing...)
  
  */
  
  Blockly.showPrefixToUser = false;
  Blockly.usePrefixInYail = false;

  /******************************************************************************
   [lyn, 12/23-27/2012, patch 16]
     Prefix labels for parameters, locals, and index variables, 
     Might want to experiment with different combintations of these. E.g., 
     + maybe all non global parameters have prefix "local" or all have prefix "param".
     + maybe index variables have prefix "index", or maybe instead they are treated as "param"
   */

  Blockly.globalNamePrefix = "global"; // For names introduced by global variable declarations
  Blockly.procedureParameterPrefix = "param"; // For names introduced by procedure/function declarations 
  Blockly.handlerParameterPrefix = "param"; // For names introduced by event handlers
  Blockly.localNamePrefix = "local"; // For names introduced by local variable declarations
  Blockly.loopParameterPrefix = "index"; // For names introduced by for loops

  Blockly.menuSeparator = " "; // Separate prefix from name with this. E.g., space in "param x"
  Blockly.yailSeparator = "_"; // Separate prefix from name with this. E.g., underscore "param_ x"

  // Curried for convenient use in field_lexical_variable.js
  Blockly.possiblyPrefixMenuNameWith = // e.g., "param x" vs "x"
    function (prefix) {
      return function (name) {
        return (Blockly.showPrefixToUser ? (prefix + Blockly.menuSeparator) : "") + name; 
      }
    };

  // Curried for convenient use in generators/yail/variables.js
  Blockly.possiblyPrefixYailNameWith = // e.g., "param_x" vs "x"
    function (prefix) {
      return function (name) {
        return (Blockly.usePrefixInYail ? (prefix + Blockly.yailSeparator) : "") + name; 
      }
    };

  Blockly.prefixGlobalMenuName = function (name) {
    return Blockly.globalNamePrefix + Blockly.menuSeparator + name;
  };

  // Return a list of (1) prefix (if it exists, "" if not) and (2) unprefixed name
  Blockly.unprefixName = function (name) {
    if (name.indexOf(Blockly.globalNamePrefix + Blockly.menuSeparator) == 0) {
      // Globals always have prefix, regardless of flags. Handle these specially
      return [Blockly.globalNamePrefix, name.substring(Blockly.globalNamePrefix.length + Blockly.menuSeparator.length)]; 
    } else if (!Blockly.showPrefixToUser) {
      return ["", name];
    } else {
      var prefixes = [Blockly.procedureParameterPrefix,
                      Blockly.handlerParameterPrefix,
                      Blockly.localNamePrefix,
                      Blockly.loopParameterPrefix]
      for (i=0; i < prefixes.length; i++) {
        if (name.indexOf(prefixes[i]) == 0) {
          // name begins with prefix
          return [prefixes[i], name.substring(prefixes[i].length + Blockly.menuSeparator.length)]
        }
      }
      // Really an error if get here ...
      return ["", name];
    }
  }
};

