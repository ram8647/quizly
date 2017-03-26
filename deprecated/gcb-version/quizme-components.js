

/**
 *  Creates Blockly.ComponentTypes, a Dictionary of App Inventor components where
 *  each component is represented by a prototype that describes its events, methods,
 *  properties, setters, and getters.
 *
 *  The components are initially represented by their JSON strings, which are stored
 *  in window.componentTypeJson.  They are read from their into Blockly.Quizme.components
 *  and copied from there to Blockly.ComponentTypes.
 * 
 *  TODO: Do we still need Blockly.Quizme.components?
 *
 *  Blockly.ComponentTypes is the Dictionary used in App Inventor (i.e., blockly-all.js).
 */

/**
 *  Creates a Dictionary of components indexed by component name. 
 *  @return {Object} the Dictory of components.
 */
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
 * Adds App Inventor component prototypes to the Blockly langage, based on a list of Component names
 *  that are currently supported by Quizly.
 *
 *  This should be called with an array contain all App Inventor components, not just
 *  used by a particular quiz.  The prototypes are retrieved from Blockly.Quizme.components.
 * 
 * @param {Array} keys An array of Component names -- e.g., ['Button', 'Sound', 'Label']
 */
Blockly.Quizme.addComponents = function(keys) {
  if (keys != undefined) 
    for (i = 0; i < keys.length; i++) {
      var key = keys[i];
      Blockly.Quizme.addComponent( JSON.stringify(Blockly.Quizme.components[key]), key+'1', 1001);
    }
}

/**
 * Adds a prototype of an App Inventor component to Blockly.ComponentTypes.
 *
 * @param {string} typeName The type of component. e.g., 'Button'
 * @param {Object} prototype A prototype of the component describing its
 *  methods, events, properties, setters, and getters. 
 */
Blockly.Quizme.addComponentType = function(typeName, prototype) {
  Blockly.ComponentTypes[typeName] = {};
  Blockly.ComponentTypes[typeName].component = prototype;
  Blockly.ComponentTypes[typeName].blocks = [];

  Blockly.ComponentTypes[typeName].eventDictionary = {};
  Blockly.ComponentTypes[typeName].methodDictionary = {};
  Blockly.ComponentTypes[typeName].setPropertyList = [];
  Blockly.ComponentTypes[typeName].getPropertyList = [];
  Blockly.ComponentTypes[typeName].properties = {};

  // Parse the component's information and fill in all of the fields

  // Events
  for(var k=0; k < prototype.events.length; k++) {
    Blockly.ComponentTypes[typeName].eventDictionary[prototype.events[k].name] = prototype.events[k];
  }

  // Methods
  for(var k=0; k < prototype.methods.length; k++) {
    Blockly.ComponentTypes[typeName].methodDictionary[prototype.methods[k].name] = prototype.methods[k];
  }

  // Properties
  for(var k=0; k < prototype.blockProperties.length; k++) {
    Blockly.ComponentTypes[typeName].properties[prototype.blockProperties[k].name] = prototype.blockProperties[k];
    if(prototype.blockProperties[k].rw == "read-write" || prototype.blockProperties[k].rw == "read-only") {
      console.log("RAM: Pushing " + typeName + "  property to getter List: " + prototype.blockProperties[k].name);
      Blockly.ComponentTypes[typeName].getPropertyList.push(prototype.blockProperties[k].name);
    }
    if(prototype.blockProperties[k].rw == "read-write" || prototype.blockProperties[k].rw == "write-only") {
      console.log("RAM: Pushing " + typeName + " property to setter List: " + prototype.blockProperties[k].name);
      Blockly.ComponentTypes[typeName].setPropertyList.push(prototype.blockProperties[k].name);
    }
  }
}

/**
 *  Adds a prototype for a component defined by its JSON string.
 *
 * @param {string} json The component's JSON string.
 * @param {string} name The component's name.
 * @param {number} uid The component instance's unique id (not really used?)
 */
Blockly.Quizme.addComponent = function(json, name, uid) {
  var prototype = JSON.parse(json);
  var typeName = prototype.name;

  if (Blockly.ComponentTypes.haveType(typeName)) {
    return;
  }

  Blockly.Quizme.addComponentType(typeName, prototype);
  Blockly.TypeBlock.needsReload.components = true;
};
