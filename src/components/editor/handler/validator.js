import * as mobx from 'mobx';

class Validator {

    constructor() {
        this.state = mobx.observable({ errors: {} });
        this.validators = {};
    }

    get errors() {
        return this.state.errors;
    }

    register = (id, valueFn, validate) => {
        this.validators[id] = { valueFn, validate };
    }

    unregister = (id) => {
        delete this.validators[id];
    }

    validate = () => {
        this.state.errors = {};
        for (const [id, { valueFn, validate }] of Object.entries(this.validators)) {
            if (!validate) {
                continue;
            }
            const scope = new ValidateScope();
            const value = valueFn();
            if (Array.isArray(value)) {
                this.validateGrid(value, validate, scope);
            } else {
                validate(value, scope);
            }
            this.state.errors[id] = scope.errors;
        };
    }

    validateGrid = (array, validate, scope) => {
        array.forEach((item, index) => {
            const itemScope = new ValidateScope();
            validate(item, itemScope);
            itemScope.errors.forEach(e => e.index = index);
            scope.errors = scope.errors.concat(itemScope.errors);
        });
    }

    errorFn = (index) => {
        // return (key) => errorKey(key, index) in this.errors;
        return () => false;
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

class ValidateScope {
    constructor() {
        this.errors = [];
    }

    _addError = (id, info) => this.errors.push({ id, ...info });

    notEmpty = (id, value) => {
        if (!(value && /\S/.test(value))) {
            this._addError(id, { type: 'not-empty' });
        }
    }

    isInteger = (id, value) => {
        if (!value) {
            return;
        }
        if (!Number.isInteger(value)) {
            this._addError(id, { type: 'is-integer' });
        }
    }
}


const errorKey = (key, index) => index ? `${key}.${index}` : key;

export default Validator;