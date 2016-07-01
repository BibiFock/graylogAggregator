import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import Msg from '../../../src/app/components/graylog/msg';
import AppRoot from '../../../src/app/components/AppRoot';

describe('<AppRoot />', () => {
    it('countains this class', () => {
        expect( shallow( <AppRoot /> ).is('.appRoot') ).to.equal(true);
    });

    it('countains messages', () => {
        expect( shallow( <AppRoot /> ).find( Msg ) ).to.have.length( 1 );
    });

    it('refresh works on click', function() {
        const spy = sinon.spy(AppRoot.prototype, 'refresh');

        const wrapper = mount(<AppRoot />);
        var callCount = spy.callCount;
        expect( wrapper.find('button.btn-refresh') ).to.have.length( 1 );

        wrapper.find('button.btn-refresh').simulate( 'click' );

        expect(spy.callCount).to.equal(callCount + 1);
    });
});
