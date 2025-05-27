const express = require("express");
require("dotenv").config();
const app = express();
const routes = require("./routes/main");

const responseHandler = require("./middlewares/response.middleware");
const httpLogger = require("./middlewares/http-logger.middleware");
const { Logger } = require("./utils/logger");

app.use(express.json());
const port = process.env.PORT || 3000;

app.use(responseHandler);
app.use(httpLogger);

app.get("/", (req, res) => {
    return res.success(null, "Welcome to the API!");
});

// Use routes
app.use(routes);

app.listen(port, () => {
    Logger.info(`Server is running on port ${port}`);
});
