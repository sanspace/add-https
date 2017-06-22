const TITLE_APPLY = "Add HTTPS";
const TITLE_REMOVE = "Remove HTTPS";


function onUpdated(tab) {
  console.log("Updated tab: ${tab.id}");
}

function onError(error) {
  console.log("Error: ${error}");
}


/*
Toggle HTTPS: based on the current title, add or remove the HTTPS.
Update the page action's title and icon to reflect its state.
*/
function toggleHttps(tab) {
  
  function gotTitle(title) {
    if (title === TITLE_APPLY) {
      browser.pageAction.setIcon({tabId: tab.id, path: "icons/padlock_green.svg"});
      browser.pageAction.setTitle({tabId: tab.id, title: TITLE_REMOVE});
      var new_url = tab.url.replace(/http:/,'https:');
      var updating = browser.tabs.update({url: new_url});
      updating.then(onUpdated, onError);
    } else {
      browser.pageAction.setIcon({tabId: tab.id, path: "icons/padlock_red.svg"});
      browser.pageAction.setTitle({tabId: tab.id, title: TITLE_APPLY});
      var new_url = tab.url.replace(/https:/, 'http:');
      var updating = browser.tabs.update({url: new_url});
      updating.then(onUpdated, onError);
    }
  }

  var gettingTitle = browser.pageAction.getTitle({tabId: tab.id});
  gettingTitle.then(gotTitle);
}

/*
Initialize the page action: set icon and title, then show.
*/
function initializePageAction(tab) {
  if (tab.url.startsWith('http:')) {
    browser.pageAction.setIcon({tabId: tab.id, path: "icons/padlock_red.svg"});
    browser.pageAction.setTitle({tabId: tab.id, title: TITLE_APPLY});
    browser.pageAction.show(tab.id);
  }
  if (tab.url.startsWith('https:')) {
    browser.pageAction.setIcon({tabId: tab.id, path: "icons/padlock_green.svg"});
    browser.pageAction.setTitle({tabId: tab.id, title: TITLE_REMOVE});
    browser.pageAction.show(tab.id);
  }
}

/*
When first loaded, initialize the page action for all tabs.
*/
var gettingAllTabs = browser.tabs.query({});
gettingAllTabs.then((tabs) => {
  for (tab of tabs) {
    initializePageAction(tab);
  }
});

/*
Each time a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializePageAction(tab);
});

/*
Toggle HTTPS when the page action is clicked.
*/
browser.pageAction.onClicked.addListener(toggleHttps);
