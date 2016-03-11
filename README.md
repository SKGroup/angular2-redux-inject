## Install
npm install redux-injectable-angular2 --save

## Example Usage (TS/ES6)

```typescript
import { Injector } from 'angular2/core';

import { applyMiddleware, createStore } from 'redux';
import { injectable } from 'redux-injectable-angular2';

// Create a separate injector or root injector
let injector: Injector = Injector.resolveAndCreate([..some_providers]);

// Create a composition from middlewaries...
// Important: "reduxInjectable" must always be the first
let middleware = compose(
    applyMiddleware(injectable(injector)),
    // ...etc
);

// Create redux store
let store = createStore(reducer, {}, middleware);
```

After being applied, all action creators will be able to return a "dependency wrapper" function which will be supplied dependencies by name. 
The wrapper's return value will be passed to the next middleware via next(). 
Therefore, the signature of an action creator for such a function would look like this:

```typescript
import { Dep1Service, Dep2Service } from 'myapp/services';

const createFooAction = (payload) => {
    return {
        deps: [Dep1Service, Dep2Service],
        resolve: (dep1: Dep1Service, dep2: Dep2Service) => {
              // ...use dep1... 
              // ...use dep2... 
              
              return { type: FOO, ...payload };
        }
    };
}
```

