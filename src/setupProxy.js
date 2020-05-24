
const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        "/search",
        createProxyMiddleware({
            target: "https://svcs.ebay.com",
            changeOrigin: true
        }

        )
    );
    /*
    app.use(
        "/services/search/FindingService/v1",
        createProxyMiddleware({
            target: "https://svcs.ebay.com",
            changeOrigin: true
        }

        )
    );
    */
};

