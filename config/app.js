var config = {
    port:1664,
    refreshDelay: '00 */5 * * * *',
    graylog: {
        auth: '<user>:<pass>',
        url: '<url>',
        port: {
            api: 12900,
            web: 9000
        },
        query: {
            //query: '(app:tools-ads* OR app:webex*) AND NOT level:5 AND NOT level:4',
            query: '(app_group:webediads) AND NOT message:\'Log user action\'',
            limit: 1000,
        },
        periods: [
            { value: 60*5, name:'5 min' },
            { value: 60*60, name:'hour' },
            { value: 60*60*12, name:'half day' },
            { value: 60*60*24, name:'day' },
            { value: 60*60*24*3, name:'last 3 days' }
        ],
        columns: {
            detail: [
                { name:'time', space:2 },
                { name:'app', space:2 },
                { name:'level', space:1 },
                { name:'source', space:2 },
                { name:'app_version', space:1 },
                { name:'url', space:4 }
            ],
            message: [
                { name:'app', space:2 },
                { name:'level', space:1 },
                { name:'app_version', space:2 },
                { name:'message', space:6 }
            ]
        }
    }
};

module.exports = config;
