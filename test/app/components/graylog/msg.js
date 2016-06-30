import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import Msg from '../../../../src/app/components/graylog/msg';
import Detail from '../../../../src/app/components/graylog/detail';
import config from '../../../../config/app';

describe('graylog msg component', function(){

    before('render and locate element', function() {
        this.data = {
            total: 20,
            messages: [{id:0}, {id:1}]
        };
        for (var i in config.graylog.columns.message) {
            var name = config.graylog.columns.message[i].name;
            this.data[name] = name;
        }
    });

    it('<div> check class "graylogMsg"', function () {
        var wrapperTitle = shallow(<Msg />);
        expect( wrapperTitle.find('.graylogMsg-title') ).to.have.length( 1 );

        var wrapper = shallow(<Msg message={ this.data } />);
        expect( wrapper.find('.graylogMsg') ).to.have.length( 1 );
    });

    it('check columns for title', function() {
        var wrapperTitle = shallow(<Msg />);
        expect( wrapperTitle.find('> .row.columns > .columns') ).to.have.length(
            config.graylog.columns.message.length + 1 // total columns
        );
    });

    it('check columns from content', function() {
        var wrapper = shallow(<Msg message={ this.data } />);
        expect( wrapper.find(Detail) ).to.have.length(
            this.data.messages.length + 1 // + title line
        );
    });

    it('toggle detail action', function() {
        const spy = sinon.spy(Msg.prototype, 'toggleDetail');

        var wrapper = shallow(<Msg message={ this.data }/>);
        wrapper.find('> .row.columns').simulate('click');

        wrapper = shallow(<Msg />);
        wrapper.find('> .row.columns').simulate('click');

        expect(spy.calledOnce).to.equal(true);
    });

});
