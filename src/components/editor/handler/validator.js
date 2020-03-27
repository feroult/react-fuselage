class Validator {

    constructor() {
        this.errors = {};
    }

    grid = (array, fn) => {
        array.forEach((el, index) => {
            const scoped = new Validator();
            fn(el, scoped);
            Object.keys(scoped.errors)
                .forEach(key => this.errors[key + '.' + index] = scoped.errors[key]);
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

    errorFn = () => {
        return () => true;
    }

}
export default Validator;