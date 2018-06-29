const PRINT_SERVICE_URL = 'https://printmenow.herokuapp.com/endpoint';
const BASE_URL = 'https://lassediercks.github.io/sistente';

const printButton = document.querySelector('#printbutton');

let urlForPrintservice;
let params = {};

document.addEventListener('DOMContentLoaded', function() {
  const nameInput = document.querySelector('#name');
  const nameTarget = document.querySelector('#nameTarget');

  syncValue(nameInput, nameTarget);

  const titleInput = document.querySelector('#title');
  const titleTarget = document.querySelector('#titleTarget');

  syncValue(titleInput, titleTarget);

  const streetInput = document.querySelector('#street');
  const streetTarget = document.querySelector('#streetTarget');

  syncValue(streetInput, streetTarget);

  const postalcodeInput = document.querySelector('#postalcode');
  const postalcodeTarget = document.querySelector('#postalcodeTarget');

  syncValue(postalcodeInput, postalcodeTarget);

  const cityInput = document.querySelector('#city');
  const cityTarget = document.querySelector('#cityTarget');

  syncValue(cityInput, cityTarget);

  const emailInput = document.querySelector('#email');
  const emailTarget = document.querySelector('#emailTarget');

  syncValue(emailInput, emailTarget);

  function updatePrintLink(input) {
    params[input.id] = input.value;

    const toUrlString = (string, keyValue) =>
      string.concat(`${keyValue[0]}=${encodeURIComponent(keyValue[1])}&`);

    let paramAttach = Object.entries(params).reduce(toUrlString, '');

    urlForPrintservice = `${BASE_URL}/?${paramAttach}`;

    console.log(urlForPrintservice);
    return urlForPrintservice;
  }

  function syncValue(input, target) {
    if (localStorage.getItem(target.id)) {
      target.innerHTML = localStorage.getItem(target.id);
      input.value = localStorage.getItem(target.id);
      updatePrintLink(input);
    }

    input.addEventListener('input', function() {
      target.innerHTML = input.value;
      localStorage.setItem(target.id, input.value);
      updatePrintLink(input);
    });

    if (getValueOfParam(input.id)) {
      let val = decodeURIComponent(getValueOfParam(input.id));
      console.log({ val });
      target.innerHTML = val;
    }
  }

  function getValueOfParam(name) {
    let url = window.location.search.substring(1);
    let vars = url.split('&');

    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=');

      if (pair[0] == name) {
        return pair[1];
      }
    }
  }

  const checkStatus = (response) => {
    if (response.ok && response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }
    return Promise.reject(response);
  };

  function createPdf(body) {
    const blob = new Blob([body], { type: 'application/pdf' });
    const data = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    console.log(typeof body);
    // The actual download
    // var filename = "blah.pdf";
    link.href = data;
    link.download = 'letterhead.pdf';
    console.log(link);
    document.body.appendChild(link);
    link.click();
  }

  function downloadPdf(url) {
    console.log(url);
    let options = {
      method: 'POST',
      body: JSON.stringify({ url: url }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    fetch(PRINT_SERVICE_URL, options)
      .then(checkStatus)
      .then((response) => response.arrayBuffer())
      .then(createPdf);
  }

  printButton.addEventListener('click', () => {
    if (urlForPrintservice) downloadPdf(urlForPrintservice);
  });
});
