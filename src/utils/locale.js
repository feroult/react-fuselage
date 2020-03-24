// import {addLocaleData} from 'react-intl'
// import en from 'react-intl/locale-data/en'
// import pt from 'react-intl/locale-data/pt'

// addLocaleData([...en, ...pt]);

const locale = {
    language: defineLanguage(),
    currency: defineCurrency()
};

const messages = defineMessages();

const decimalSeparator = new Intl.NumberFormat(locale.language).format(0.1)[1];
const thousandsSeparator = new Intl.NumberFormat(locale.language).format(1000)[1];
const currencySymbol = new
    Intl.NumberFormat(locale.language,
        {
            style: 'currency',
            currency: locale.currency,
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }).format(1).replace('1', '');

function toNumber(value) {
    if (typeof value === 'number') {
        return value;
    }
    if (decimalSeparator !== '.') {
        value = value.replace(decimalSeparator, '.');
    }
    return +value;
}

function formatCurrency(formatNumber, value, options) {
    if (value === undefined || value == null || value === '' || isNaN(value)) {
        return '';
    }
    if (isNaN(value)) {
        return value;
    }
    const defaultOptions = {
        style: 'currency',
        currency: locale.currency,
        currencyDisplay: 'symbol',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    };
    if (value % 1 !== 0) {
        defaultOptions.minimumFractionDigits = 2;
    }
    Object.assign(defaultOptions, options);
    return formatNumber(value, defaultOptions);
}

function formatPercent(formatNumber, value, options) {
    if (value === undefined || value == null || value === '') {
        return '';
    }
    if (isNaN(value)) {
        return value;
    }
    const defaultOptions = {
        style: 'percent',
        maximumFractionDigits: 2,
        minimumFractionDigits: 0
    };
    Object.assign(defaultOptions, options);
    return formatNumber(value / 100, defaultOptions);
}

function defineCurrency() {
    if (defineLanguage() === "en-US") {
        return "USD";
    }
    if (defineLanguage() === "pt-BR") {
        return "BRL";
    }
    return "";
}

function defineLanguage() {
    if (true) {
        return "en-US";
    }
    const language = (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        navigator.userLanguage;
    return language;
}

function defineMessages() {
    // TODO: fixme
    // return require('../i18n/' + defineLanguage() + '.json');
}

function parseMessages(array) {
    const map = {}
    array.forEach(m => {
        map[m.id] = m.defaultMessage;
    });
    return map;
}

export { parseMessages, locale, messages, formatCurrency, formatPercent, currencySymbol, thousandsSeparator, toNumber };