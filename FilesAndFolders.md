## Files (alphabetically) ##

  * ctivity-quizme.js -- functions for embedding Quizly in CodeBuilder.

  * lockly-all.js -- a concatenation of all the App Inventor-based version of Blockly. This means that the default Blockly language files, such  as math.js, are replaced by their App Inventor versions. This file should  be copied from build/blocklyeditor/blockly-all.js to be kept up-to-date  with App Inventor releases.

  * blockly-toolbox.js -- a slightly revised version of the core Blockly  toolbox.js.  App Inventor uses drawer.js instead of toolbox.js, but  drawer.js is partially dependent on GWT.  This vesion of Toolbox  allows the drawers of blocks to be incorporated as a menu within  the Blockly main workspace.  Among other things, this version does not load the Blockly version of procedures and variables.

  * blockly.html -- HTML code for the Blockly iframe. Contains the  initBlockly() function which injects BLockly and calls the  window.parent.blocklyLoaded() function to initial parent window.

  * component-types.js -- JSON definitions of all App Inventor components,  e.g., Button, Sounds, etc.

  * index.html -- Base document for Quizly app, loaded into parent window.

  * javascript.js -- From Blockly, helper functions for generating  javascript for blocks.

  * javascript/ -- Modified from Blockly. Helper functions for generating  javascript for the AppInventor versions of math, logic, text,  etc. blocks.

  * jquery-1.9.1.min.js -- Minimized JQuery library. (Should this be removed from repository?)

  * language/ -- Directory containing App Inventor versions of math.js,  logic.js and other Blockly blocks.

  * makequiz-helper.js -- functions for embedding Quizly into makequiz  app.

  * makequiz.html -- Base document for the makequiz app.

  * media -- a directory containing all the media files. This has  to be on the blockly path.

  * quizme-components.js -- Helper functions and XML code for loading  AppInventor components into the workspace.

  * quizme-eval.js -- Functions for managing quizzes for Coursebuilder.

  * quizme-helper.js -- functions that support the quiz buttons and  menus within the browser.  This is where Blockly is injected into  the browser window.

  * quizme-initblocklyeditor.js  -- a slightly revised version of the  Blockly.BlocklyEditor.start() function.  This version drops  the creation of Drawer.

  * quizme.js -- the Blockly.Quizme class.
