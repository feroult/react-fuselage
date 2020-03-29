import * as mobx from 'mobx';

class Validator {

    constructor() {
        this.state = mobx.observable({ errors: {} });
        this.validators = {};
    }

    get errors() {
        return this.state.errors;
    }

    register = (fuseId, valueFn, validateFn) => {
        if (!(fuseId in this.validators)) {
            this.validators[fuseId] = { valueFn, validateFn };
        }
    }

    validate = () => {
        const scope = new ValidateScope();
        this._scopedValidate(scope);
        this.state.errors = {};
        scope.errors.forEach(({ id, info }) => {
            this.state.errors[id] = info;
        });
    }

    revalidate = () => {
        const scope = new ValidateScope();
        this._scopedValidate(scope);
        const errors = {};
        scope.errors.forEach(({ id, info }) => errors[id] = info);
        for (const [id, info] of Object.entries(mobx.toJS(this.errors))) {
            if (id in errors) {
                if (Array.isArray(info)) {
                    info.forEach(item => {
                        const itemErrors = e => e.id === item.id && e.index === item.index
                        this.errors[id] = this.errors[id].filter(e => !itemErrors(e))
                        this.errors[id] = this.errors[id].concat(errors[id].filter(itemErrors))
                    });
                }
            }
        };
    }

    _scopedValidate = (globalScope) => {
        for (const [fuseId, { valueFn, validateFn }] of Object.entries(this.validators)) {
            if (!validateFn) {
                continue;
            }
            const scope = new ValidateScope();
            const value = valueFn();
            if (Array.isArray(value)) {
                this.validateGrid(value, validateFn, scope);
            } else {
                validateFn(value, scope);
            }
            globalScope.errors.push({ id: fuseId, info: scope.errors });
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