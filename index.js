var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button = buttons.ActionButton({
  id: "secureit-button",
  label: "Add HTTPS",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick
});

function handleClick(state) {
  var tabs = require("sdk/tabs");
  // Change active tab url from http to https
  tabs.activeTab.url = tabs.activeTab.url.replace(/http:/, 'https:');
}