export default function createRequest(options) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const url = 'http://localhost:7070';
    const params = new URLSearchParams();
    const optionsArr = Object.entries(options.options);

    for (let i = 0; i < optionsArr.length; i++) {
      params.append(optionsArr[i][0], optionsArr[i][1]);
    }

    if (options.parameter === 'GET') {
      xhr.open('GET', `${url}?${params}`);
      xhr.send();
    } else if (options.parameter === 'POST') {
      xhr.open('POST', `${url}?${params}`);
      xhr.send(JSON.stringify(options.options));
    } else if (options.parameter === 'PUT') {
      xhr.open('PUT', `${url}?${params}`);
      xhr.send(JSON.stringify(options.options));
    } else if (options.parameter === 'DELETE') {
      xhr.open('DELETE', `${url}?${params}`);
      xhr.send();
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 204) {
        resolve(xhr.responseText);
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          reject(xhr.status);
        }
      }
    });
  });
}
