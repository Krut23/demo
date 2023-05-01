"use strict";
const redis = require("redis");
const redisclient = redis.createClient();
(async () => {
    await redisclient.connect();
})();
redisclient.on("ready", () => {
    console.log(" Redis Connected");
});
redisclient.on("error", (_error) => {
    console.log("Error in the Connection");
});
//# sourceMappingURL=Redisclient.js.map