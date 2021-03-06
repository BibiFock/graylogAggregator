import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import Detail from '../../../../src/app/components/graylog/detail';
import config from '../../../../config/app';

describe('Graylog detail component', function(){

    before('render and locate element', function() {
        this.wrapperTitle = mount( <Detail /> );
        var data = this.data = config.graylog.columns.detail.map( (row) => {
            return row.name;
        });
        data._id = 1;
        this.wrapper = mount( <Detail data={ data } /> );
    });

    it('<div> check class "graylogDetail"', function () {
        expect( this.wrapper.find('.graylogDetail') ).to.have.length( 1 );
        expect( this.wrapperTitle.find('.graylogDetail.title') ).to.have.length( 1 );
    });

    it('title need to be center', function() {
        expect( this.wrapperTitle.find('.title.text-center') ).to.have.length( this.data.length );
    });

    it('check nb columns', function() {
        expect( this.wrapper.find('> .columns') ).to.have.length( this.data.length );
    });

    it('check state data', function() {
        expect( this.wrapper.props().data ).to.have.length( this.data.length );
    });

    it('click action', function() {
        const spy = sinon.spy(Detail.prototype, 'openLink');

        const wrapper = shallow(<Detail data={this.data} />);
        wrapper.simulate('click');

        expect(spy.called).to.equal(true);
    });

});
