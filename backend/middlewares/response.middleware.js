const responseHandler = (req, res, next) => {
    res.success = (message = null) => {
        return res.status(200).json({
            status: true,
            message: message || "Success",
        });
    };

    res.successWithData = (data, message = null) => {
        return res.status(200).json({
            status: true,
            message: message || "Success",
            data: data,
        });
    };

    res.successWithPagination = (data, pagination, message = null) => {
        return res.status(200).json({
            status: true,
            message: message || "Success",
            data: data,
            pagination: pagination,
        });
    };

    res.created = (message = null) => {
        return res.status(201).json({
            status: true,
            message: message || "Success",
        });
    };

    res.createdWithData = (data, message = null) => {
        return res.status(201).json({
            status: true,
            message: message || "Success",
            data: data,
        });
    };

    res.badRequest = (message = null) => {
        return res.status(400).json({
            status: false,
            message: message || "Bad Request",
        });
    };

    res.notFound = (message = null) => {
        return res.status(404).json({
            status: false,
            message: message || "Requested Resource Not Found",
        });
    };

    res.unauthorized = (message = null) => {
        return res.status(401).json({
            status: false,
            message: message || "Unauthorized",
        });
    };

    res.forbidden = (message = null) => {
        return res.status(403).json({
            status: false,
            message: message || "Forbidden",
        });
    };

    res.internalServerError = (message = null) => {
        return res.status(500).json({
            status: false,
            message: message || "Internal Server Error",
        });
    };

    res.sendPdf = (pdf) => {
        res.setHeader("Content-Type", "application/pdf");
        res.send(pdf);
    };

    next();
};

module.exports = responseHandler;
