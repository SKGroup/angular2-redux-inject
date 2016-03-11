## Install
npm install angular2-redux-inject --save

## Example Usage (TS/ES6)

```typescript
import { Injector } from 'angular2/core';

import { applyMiddleware, createStore } from 'redux';
import { injector as injectorMiddleware } from 'angular2-redux-inject';

// Create a separate injector or root injector
let injector: Injector = Injector.resolveAndCreate([..some_providers]);

// Create a composition from middlewaries...
// Important: "injectorMiddleware" must always be the first
let middleware = compose(
    applyMiddleware(injectorMiddleware(injector)),
    // ...etc
);

// Create redux store
let store = createStore(reducer, {}, middleware);
```

Action creator would look like this:

```typescript
import { Dep1Service, Dep2Service } from 'myapp/services';

const createFooAction = (payload) => {
    return {
        deps: [Dep1Service, Dep2Service],
        injectable: (dep1: Dep1Service, dep2: Dep2Service) => {
              // ...use dep1... 
              // ...use dep2... 
              
              return { type: FOO, ...payload };
        }
    };
}
```

