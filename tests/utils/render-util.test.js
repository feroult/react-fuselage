import React, {Component} from 'react';

import expect from 'expect';

import RenderUtil from "src/utils/render-util";

class CompX extends Component {
}

class CompY extends Component {
}

class CompZ extends Component {
}

describe('RenderUtil', () => {
    it('splits components by type', () => {
        const comp = (
            <div>
                <CompX/>
                <CompY/>
                <CompY/>
                <CompZ/>
            </div>
        );

        const map = RenderUtil.splitChildren(comp.props.children, {compX: CompX, compY: CompY});
        expect(map.compX.length).toEqual(1);
        expect(map.compY.length).toEqual(2);
        expect(map.other.length).toEqual(1);
    });

});