import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import humanize from 'humanize';

import Since from '../../../../src/app/components/util/since';

describe('Since component', function(){

    before('render and locate element', function() {
        this.date = new Date();
        this.wrapper = mount( <Since date={ this.date } /> );
    });

    it('<span> check class "since"', function () {
        expect( this.wrapper.is('since') ).to.equal( true );
    });

    it('value should be of type "just now"', function () {
        expect(
            this.wrapper.text()
        ).to.equal( humanize.relativeTime(this.date.getTime() / 1000) );
    });

    it('value should be of type "2 seconds ago"', function (done) {
        this.timeout(5000);
        var wrapper = this.wrapper;
        setTimeout(function() {
            expect( wrapper.text() ).to.match( /^\d seconds ago$/ );
            done();
        }, 3000);
    });

});
