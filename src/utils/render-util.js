import React from 'react';

class RenderUtil {
    static splitChildren(children, mapping) {
        const keys = Object.keys(mapping);
        const length = keys.length;
        return React.Children.toArray(children).reduce((result, child) => {
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
                result['other'].push(child);
            }
            return result;
        }, { other: [] });

    }

}

let nextId = 0;
const fuseId = () => `fuselage#${nextId++}`;


export default RenderUtil;
export { fuseId }