/**
 * Project: angular2-redux-inject
 * File:  2016-03-10 23:53
 * ----------------------------------------------
 *
 * @author      Stanislav Kiryukhin <korsar.zn@gmail.com>
 * @copyright   Copyright (c) 2016, SKGroup
 *
 * ----------------------------------------------
 * All Rights Reserved.
 * ----------------------------------------------
 */
import {Injector, ConcreteType} from 'angular2/core';

export interface IActionInjectable {
    injectable: () => any;
    deps: Array<ConcreteType>;
}

export function injector(injector: Injector) {

    function isInjectable(action: IActionInjectable): boolean {
        if (!('injectable' in action)) {
            return false;
        }

        if (typeof action.injectable !== 'function') {
            throw new Error('Parameter "injectable" should be a function');
        }

        if (typeof action.deps !== 'object' || !Array.isArray(action.deps)) {
            throw new Error('Parameter "deps" should be a Array<ConcreteType>');
        }

        return true;
    }

    function injectDependencies(injector: Injector, action: IActionInjectable): any {
        let dependencies: Array<ConcreteType> = [];

        for (let token of action.deps) {
            dependencies.push(injector.get(token));
        }

        return action.injectable.apply(null, dependencies);
    }

    return (store: any) => (next: Function) => (action: any) => {
        if (isInjectable(action)) {
            return next(injectDependencies(injector, action));
        } else {
            return next(action);
        }
    };
}
