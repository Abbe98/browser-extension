function discoverAccount() {
  let accountName;
  // TODO store the data (urls, case-sensitivity, etc) in an object and process that instead of using if/else
  if (document.location.origin == 'https://twitter.com') {
    accountName = cleanAccountName(document.location.pathname.substring(1), caseSensitive = false);
    return accountIndex.twitter[accountName];
  } else if (document.location.origin == 'https://www.facebook.com') {
    accountName = cleanAccountName(document.location.pathname.substring(1), caseSensitive = false);
    return accountIndex.facebook[accountName];
  } else if (document.location.origin == 'https://github.com') {
    accountName = cleanAccountName(document.location.pathname.substring(1), caseSensitive = false);
    return accountIndex.github[accountName];
  }

  return;
}

function cleanAccountName(accountName, caseSensitive) {
  if (accountName.endsWith('/')) {
    accountName = accountName.substring(0, accountName.length - 1);
  }
  if (!caseSensitive) {
    return accountName.toLowerCase();
  }
  return accountName;
}

// TODO is this a safe way to casify country names?
function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(function (word) {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
}

function getAccountInformation(govdirectoryId) {
  const country = toTitleCase(govdirectoryId.split('/')[0].replace('-', ' '));
  return [country, govdirectoryId];
}

// TODO if we index org types we could check for (?:of|in) [A-Z]\w+ to present a less generic type of message
function render(accountInformation) {
  const accountInformationElement = document.createElement('div');
  accountInformationElement.classList.add('govdirectory-browser-extension-namespace');
  const innerHTML = `<div>
                         <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15"><path stroke="#e66a49" fill="#e66a49" d="M6.65,2C5.43,2,4.48,3.38,4.11,3.82C4.0365,3.9102,3.9975,4.0237,4,4.14v4.4C3.9884,8.7827,4.1758,8.9889,4.4185,9.0005&#xA;&#x9;C4.528,9.0057,4.6355,8.9699,4.72,8.9c0.4665-0.6264,1.1589-1.0461,1.93-1.17C8.06,7.73,8.6,9,10.07,9&#xA;&#x9;c0.9948-0.0976,1.9415-0.4756,2.73-1.09c0.1272-0.0934,0.2016-0.2422,0.2-0.4V2.45c0.0275-0.2414-0.1459-0.4595-0.3874-0.487&#xA;&#x9;C12.5332,1.954,12.4527,1.9668,12.38,2c-0.6813,0.5212-1.4706,0.8834-2.31,1.06C8.6,3.08,8.12,2,6.65,2z M2.5,3&#xA;&#x9;c-0.5523,0-1-0.4477-1-1s0.4477-1,1-1s1,0.4477,1,1S3.0523,3,2.5,3z M3,4v9.48c0,0.2761-0.2239,0.5-0.5,0.5S2,13.7561,2,13.48V4&#xA;&#x9;c0-0.2761,0.2239-0.5,0.5-0.5S3,3.7239,3,4z"/></svg>
                       </div>
                       <div>
                         <button id="govdirectory-browser-extension-namespace-close" title="close">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" class="bi bi-x-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/><path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/></svg>
                         </button>
                         <h1>This account appears to belong to a government agency (${accountInformation[0]})</h1>
                         <a href="https://www.govdirectory.org/${accountInformation[1]}">Learn more on Govdirectory</a>
                       </div>`;
  accountInformationElement.innerHTML = innerHTML;
  document.body.insertBefore(accountInformationElement, document.body.firstChild);

  document.querySelector('#govdirectory-browser-extension-namespace-close').addEventListener('click', () => {
    document.querySelector('.govdirectory-browser-extension-namespace').remove();
  });
}

function main() {
  const prevContainer = document.querySelector('.govdirectory-browser-extension-namespace');
  if (prevContainer) prevContainer.remove();

  const indexedAccount = discoverAccount();
  if (!indexedAccount) return;
  const accountInformation = getAccountInformation(indexedAccount);
  render(accountInformation);
}

// this ensures that main() is only called when the page is loaded but also when the user navigates to a new "page" in a webapp.
let oldHref = document.location.pathname;
main();
let body = document.querySelector('body');

const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (oldHref != document.location.pathname) {
      oldHref = document.location.pathname;
      main();
    }
  });
});

const config = {
  childList: true,
  subtree: true,
};

observer.observe(body, config);
