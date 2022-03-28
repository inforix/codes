async function xhrAsync(url) {
  return new Promise(resolve => {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.open("GET", url, true);
    xhr.onload = function (e) {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      resolve(null);
      console.error("** An error occurred during the XMLHttpRequest");
    };
    xhr.send();
  })
}


async function downloadAsync(text, url) {
  let response = await xhrAsync(url);
  if (response) {
    var a = document.createElement('a');
    var file;
    file = new Blob([response], {
      type: 'application/octet-stream'
    });
    a.href = window.URL.createObjectURL(file);
    a.download = text + '.xls';
    // Now just click the link you created
    // Note that you may have to append the a element to the body somewhere
    // for this to work in Firefox
    a.click();
  } else {
    console.error('error download ' + text + ' , url: ' + url);
  }
}

const filterArray = [
  "3-9",
  "3-12",
  "3-13",
  "3-17",
  "4-4",
  "4-5",
  "4-7",
  "4-6"
];

(async () => {
  var list = [];
  let year = $('a.current').text();

  var trs = $('#ResultList_jy tr')
  for (var i = 0; i < trs.length; i++) {
    let tr = trs[i];
    let text = $(tr).find('td:nth-child(1)').text().replace(/—/g, '-').trim()
    /*
  if(filterArray.filter(x=>text.startsWith(x)).length == 0) {
      console.log('ignore ' + text + '.');
	  continue;
  }*/

    let links = $(tr).find('td:nth-child(3) a:nth-child(2)')
    if (links.length == 0) {
      continue;
    }
    let link = $(links).prop('href');

    console.log(text, ', ', link);
    list.push(downloadAsync(year + '-' + text, link));

  }

  console.log('There are ' + list.length + ' files to download...');
  await Promise.all(list);

  console.log('All files downloaded !!! ');

})();