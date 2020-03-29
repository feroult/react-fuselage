import * as mobx from 'mobx';

class Validator {

    constructor() {
        this.state = mobx.observable({ errors: {} });
        this.validators = {};
    }

    get errors() {
        return this.state.errors;
    }

    register = (fuseId, valueFn, validate) => {
        this.validators[fuseId] = { valueFn, validate };
    }

    unregister = (fuseId) => {
        delete this.validators[fuseId];
    }

    validate = () => {
        this.state.errors = {};
        for (const [fuseId, { valueFn, validate }] of Object.entries(this.validators)) {
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
            this.state.errors[fuseId] = scope.errors;
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

    errorFn = (fuseId, index) => {
        return (id) => {
            const errors = this.errors[fuseId];
            if (!errors) {
                return false;
            }
            return errors.some(e => e.id === id && e.index === index)
        }
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

export default Validator;