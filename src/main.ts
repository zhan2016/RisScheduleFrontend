import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Env } from 'env';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  const makeRequest = (url: string, method: string = 'GET'): Promise<any> => {

    // Create the XHR request
    const request = new XMLHttpRequest();
  
    // Return it as a Promise
    return new Promise((resolve, reject) => {
  
      // Setup our listener to process compeleted requests
      request.onreadystatechange = () => {
  
        // Only run if the request is complete
        if (request.readyState !== 4) return;
  
        // Process the response
        if (request.status >= 200 && request.status < 300) {
          // If successful
          return resolve(JSON.parse(request.responseText));
        } else {
          // If failed
          return reject({
            status: request.status,
            statusText: request.statusText,
          });
        }
  
      };
  
      // Setup our HTTP request
      request.open(method, url, true);
  
      // Send the request
      request.send();
  
    });
  };
  
  makeRequest("/assets/env.json")
    .then(resp => Object.keys(resp).map(respKey => (Env as any)[respKey] = resp[respKey]))
    .then(() => platformBrowserDynamic().bootstrapModule(AppModule))
    .catch(err => console.error(err));
