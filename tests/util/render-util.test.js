import expect from 'expect';

import RenderUtil from "src/util/render-util.js";

class CompX {
    type = CompX;
}

class CompY {
    type = CompY;
}

class CompZ {
    type = CompZ;
}

describe('RenderUtil', () => {

    it('splits components by type', () => {
        const children = [new CompX(), new CompY(), new CompY(), new CompZ()];
        const map = RenderUtil.splitChildren(children, {compX: CompX, compY: CompY});
        expect(map.compX.length).toEqual(1);
        expect(map.compY.length).toEqual(2);
        expect(map.other.length).toEqual(1);
    });

});