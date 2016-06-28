import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import Msg from '../../../../src/app/components/graylog/msg';
import config from '../../../../config/app';

describe('Msg detail component', function(){

    before('render and locate element', function() {
        this.wrapperTitle = mount( <Msg /> );
        var data = this.data = config.graylog.columns.message.map( (row) => {
            return row.name;
        });
        data._id = 1;
        this.wrapper = mount( <Msg data={ data } /> );
    });

    it('<div> check class "graylogMsg"', function () {
        expect( this.wrapper.find('.graylogMsg') ).to.have.length( 1 );
        expect( this.wrapperTitle.find('.graylogMsg-title') ).to.have.length( 1 );
    });

    it('check state data', function() {
        expect( this.wrapper.props().data ).to.have.length( this.data.length );
    });

});
