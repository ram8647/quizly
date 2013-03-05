

/**
 *  A dictionary of App Inventor components, where the key is the type of Component and th
 *   value is its Json code. One way to find a component's Json code:
 *
 *  1) Using the newblocks version of App Inventor, open the browsers development
 *     tools.  In Chrome, these are under View > Developer > Developer Tools
 *  2) Under the 'Source' tab in the development environment, place a breakpoint
 *     at the beginning of the Blockly.Component.add() method.  This is the method
 *     that is called when you click on a Component prototype in the Palette and
 *     drag it to the Viewer panel.
 *  3) Drag the desired component from the Palette to the viewer, causing the
 *     stop at the breakpoint.
 *  4) Inspect the value of the 'typeJsonString' parameter.  This is the basic
 *     value you want to capy and paste into this dictionary.  
 *  5) Note that you may have to delete the last few characters of the Json string.
 *     You want a string formatted as in the examples showed here. 
 *
 */

// Blockly.Quizme.components = {

//   // NOTE: This is the JSon code for Button from appinventor/build/blocklyeditor/component-types.js
//   // We should get quizme to work with this format b/c that file contains the definitions for all
//   // components

//   Button: 
// '{ "name": "Button", "version": "4",  "categoryString": "BASIC",  "helpString": "Button with the ability to detect clicks.  Many aspects of its appearance can be changed, as well as whether it is clickable (<code>Enabled<\/code>), can be changed in the Designer or in the Blocks Editor.",  "showOnPalette": "true",  "nonVisible": "false",  "iconName": "",  "properties": [{ "name": "BackgroundColor", "editorType": "color", "defaultValue": "&H00000000"},{ "name": "Enabled", "editorType": "boolean", "defaultValue": "True"},{ "name": "FontBold", "editorType": "boolean", "defaultValue": "False"},{ "name": "FontItalic", "editorType": "boolean", "defaultValue": "False"},{ "name": "FontSize", "editorType": "non_negative_float", "defaultValue": "14.0"},{ "name": "FontTypeface", "editorType": "typeface", "defaultValue": "0"},{ "name": "Image", "editorType": "asset", "defaultValue": ""},{ "name": "Shape", "editorType": "button_shape", "defaultValue": "0"},{ "name": "Text", "editorType": "string", "defaultValue": ""},{ "name": "TextAlignment", "editorType": "textalignment", "defaultValue": "1"},{ "name": "TextColor", "editorType": "color", "defaultValue": "&H00000000"},{ "name": "Visible", "editorType": "visibility", "defaultValue": "True"}],  "blockProperties": [{ "name": "BackgroundColor", "description": "Returns the button\'s background color", "type": "number", "rw": "read-write"},    { "name": "Column", "description": "", "type": "number", "rw": "invisible"},    { "name": "Enabled", "description": "", "type": "boolean", "rw": "read-write"},    { "name": "FontBold", "description": "", "type": "boolean", "rw": "invisible"},    { "name": "FontItalic", "description": "", "type": "boolean", "rw": "invisible"},    { "name": "FontSize", "description": "", "type": "number", "rw": "invisible"},    { "name": "FontTypeface", "description": "", "type": "number", "rw": "invisible"},    { "name": "Height", "description": "", "type": "number", "rw": "read-write"},    { "name": "Image", "description": "Specifies the path of the button\'s image.  If there is both an Image and a BackgroundColor, only the Image will be visible.", "type": "text", "rw": "read-write"},    { "name": "Row", "description": "", "type": "number", "rw": "invisible"},    { "name": "Shape", "description": "Specifies the button\'s shape (default, rounded, rectangular, oval). The shape will not be visible if an Image is being displayed.", "type": "number", "rw": "invisible"},    { "name": "Text", "description": "", "type": "text", "rw": "read-write"},    { "name": "TextAlignment", "description": "", "type": "number", "rw": "invisible"},    { "name": "TextColor", "description": "", "type": "number", "rw": "read-write"},    { "name": "Visible", "description": "Specifies whether the component should be visible on the screen. Value is true if the component is showing and false if hidden.", "type": "boolean", "rw": "read-write"},    { "name": "Width", "description": "", "type": "number", "rw": "read-write"}],  "events": [{ "name": "Click", "description": "Indicates a user has clicked on the button.", "params": []},    { "name": "GotFocus", "description": "Indicates the cursor moved over the button so it is now possible\n to click it.", "params": []},    { "name": "LongClick", "description": "Indicates a user has long clicked on the button.", "params": []},    { "name": "LostFocus", "description": "Indicates the cursor moved away from the button so it is now no\n longer possible to click it.", "params": []}],  "methods": []}',

// //   Button: '{"name":"Button","version":"4","categoryString":"BASIC","helpString":"","showOnPalette":"true","nonVisible":"false","iconName":"","properties":[{"name":"BackgroundColor","editorType":"color","defaultValue":"&H00000000"},{"name":"Enabled","editorType":"boolean","defaultValue":"True"},{"name":"FontBold","editorType":"boolean","defaultValue":"False"},{"name":"FontItalic","editorType":"boolean","defaultValue":"False"},{"name":"FontSize","editorType":"non_negative_float","defaultValue":"14.0"},{"name":"FontTypeface","editorType":"typeface","defaultValue":"0"},{"name":"Image","editorType":"asset","defaultValue":""},{"name":"Shape","editorType":"button_shape","defaultValue":"0"},{"name":"Text","editorType":"string","defaultValue":""},{"name":"TextAlignment","editorType":"textalignment","defaultValue":"1"},{"name":"TextColor","editorType":"color","defaultValue":"&H00000000"},{"name":"Visible","editorType":"visibility","defaultValue":"True"}],"blockProperties":[{"name":"BackgroundColor","description":"Returns the button\'s background color","type":"number","rw":"read-write"},{"name":"Column","description":"","type":"number","rw":"invisible"},{"name":"Enabled","description":"","type":"boolean","rw":"read-write"},{"name":"FontBold","description":"","type":"boolean","rw":"invisible"},{"name":"FontItalic","description":"","type":"boolean","rw":"invisible"},{"name":"FontSize","description":"","type":"number","rw":"invisible"},{"name":"FontTypeface","description":"","type":"number","rw":"invisible"},{"name":"Height","description":"","type":"number","rw":"read-write"},{"name":"Image","description":"","type":"text","rw":"read-write"},{"name":"Row","description":"","type":"number","rw":"invisible"},{"name":"Shape","description":"","type":"number","rw":"invisible"},{"name":"Text","description":"","type":"text","rw":"read-write"},{"name":"TextAlignment","description":"","type":"number","rw":"invisible"},{"name":"TextColor","description":"","type":"number","rw":"read-write"},{"name":"Visible","description":"","type":"boolean","rw":"read-write"},{"name":"Width","description":"","type":"number","rw":"read-write"}],"events":[{"name":"Click","description":"","params":[]},{"name":"GotFocus","description":"","params":[]},{"name":"LongClick","description":"","params":[]},{"name":"LostFocus","description":"","params":[]}],"methods":[]}',

//   Sound: '{"name":"Sound","version":"3","categoryString":"MEDIA","helpString":"","showOnPalette":"true","nonVisible":"true","iconName":"images\/soundEffect.png","properties":[{"name":"MinimumInterval","editorType":"non_negative_integer","defaultValue":"500"},{"name":"Source","editorType":"asset","defaultValue":""}],"blockProperties":[{"name":"MinimumInterval","description":"","type":"number","rw":"read-write"},{"name":"Source","description":"","type":"text","rw":"read-write"}],"events":[],"methods":[{"name":"Pause","description":"","params":[]},{"name":"Play","description":"","params":[]},{"name":"Resume","description":"","params":[]},{"name":"Stop","description":"","params":[]},{"name":"Vibrate","description":"","params":[{"name":"millisecs","type":"number"}]}]}', 

// }

Blockly.Quizme.inputFromComponentsArray = function() {
  console.log("RAM: inputting components from window.componentTypeJson");
  var obj = {};
  var compArr = window.componentTypeJson;
  if (!compArr) {
    console.log("Error: Can't find componentTypeJson array");
    return obj;
  }
  
  for (var i=0; i < compArr.length; i++) {
    obj[compArr[i].name] = compArr[i];
  }
  return obj;
}


/**
 * Adds App Inventor components to the Blockly langage, based on a list of keys.
 * 
 * Call this method with an array of the names of components you want added to 
 *  the Quizme (blockly) blocks drawers menu.
 * 
 * @param keys an array of key names
 */
Blockly.Quizme.addComponents = function(keys) {
  if (keys != undefined) 
    for (i = 0; i < keys.length; i++) {
      var key = keys[i];
      Blockly.Component.add( JSON.stringify(Blockly.Quizme.components[key]), key+'1', 1001);
    }
} 

