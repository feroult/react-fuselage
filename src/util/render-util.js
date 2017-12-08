class RenderUtil {
    static splitChildren(children, mapping) {
        const keys = Object.keys(mapping);
        const length = keys.length;
        return children.reduce((result, child) => {
            let i;
            for (i = 0; i < length; i++) {
                const key = keys[i];
                if (child.type === mapping[key]) {
                    if (!(key in result)) {
                        result[key] = [];
                    }
                    result[key].push(child);
                    break;
                }
            }
            if (i === length) {
                if (!('other' in result)) {
                    result['other'] = [];
                }
                result['other'].push(child);
            }
            return result;
        }, {});

    }
}

export default RenderUtil;