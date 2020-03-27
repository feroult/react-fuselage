import * as mobx from 'mobx';

class Validator {

    constructor() {
        this.errors = mobx.observable({});
    }

    grid = (array, fn) => {
        array.forEach((el, index) => {
            const scoped = new Validator();
            fn(el, scoped);
            Object.keys(scoped.errors)
                .forEach(key => this.errors[errorKey(key, index)] = scoped.errors[key]);
        });
    }

    notEmpty = (key, value) => {
        if (!(value && /\S/.test(value))) {
            this.errors[key] = 'not-empty';
        }
    }

    isInteger = (key, value) => {
        if (!Number.isInteger(value)) {
            this.errors[key] = 'is-integer';
        }
    }

    errorFn = (index) => {
        return (key) => errorKey(key, index) in this.errors;
    }

}

const errorKey = (key, index) => index ? `${key}.${index}` : key;

export default Validator;