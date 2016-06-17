var React = require('react/addons'),
    assert = require('assert'),
    humanize =require('humanize'),
    Since = require('../../../../src/app/components/util/since'),
    TestUtils = React.addons.TestUtils;

describe('Since component', function(){
    before('render and locate element', function() {
        this.date = new Date();
        var renderedComponent = TestUtils.renderIntoDocument(
            <Since date={ this.date } />
        );

        var component = TestUtils.findRenderedDOMComponentWithTag(
            renderedComponent,
            'span'
        );

        this.spanEl = component.getDOMNode();
    });

    it('<span> should be of type "since"', function () {
        assert(this.spanEl.getAttribute('class') == 'since');
    });

    it('value should be of type "just now"', function () {
        assert(
            this.spanEl.innerHTML == humanize.relativeTime(this.date.getTime() / 1000)
        );
    });

    it('value should be of type "2 seconds ago"', function (done) {
        this.timeout(5000);
        var span  = this.spanEl;
        var date = this.date;
        setTimeout(function() {
            assert(span.innerHTML == humanize.relativeTime(date.getTime() / 1000));
            done();
        }, 2000);
    });

});
