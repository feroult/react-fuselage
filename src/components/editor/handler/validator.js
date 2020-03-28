import * as mobx from 'mobx';

class Validator {

    constructor() {
        this.errors = mobx.observable({});
        this.validators = {};
    }

    register = (id, valueFn, validator) => {
        this.validators[id] = { valueFn, validator };
    }

    unregister = (id) => {
        delete this.validators[id];
    }

    validate = () => {
        Object.values(this.validators).forEach(v => {
            if (!v.validator) {
                return;
            }
            const value = v.valueFn();
            if (Array.isArray(value)) {
                value.forEach(item => v.validator(item, this));
            } else {
                v.validator(value, this);
            }
        });
    }

    // validators

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

    // errors

    errorFn = (index) => {
        return (key) => errorKey(key, index) in this.errors;
    }

    moveGridRecord = (fromIndex, toIndex) => {
        const fromErrors = [];
        const toErrors = []
        const entries = Object.entries(this.errors);
        for (const [key, error] of entries) {
            if (key.endsWith(`.${fromIndex}`)) {
                fromErrors.push({ key, error })
            }
            if (key.endsWith(`.${toIndex}`)) {
                toErrors.push({ key, error })
            }
        }


        console.log('here', fromIndex, toIndex);
    }


}

const errorKey = (key, index) => index ? `${key}.${index}` : key;

export default Validator;