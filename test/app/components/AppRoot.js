import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import AppRoot from '../../../src/app/components/AppRoot';

describe('<AppRoot />', () => {
    it('countains this class', () => {
        expect( shallow( <AppRoot /> ).is('.appRoot') ).to.equal(true);
    });
});
