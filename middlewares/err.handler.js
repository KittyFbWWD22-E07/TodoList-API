// 404 handler
export const noRoute = async (req, res, next) => {
    const err = new Error("Route not defined");
    err.status = 404;
    next(err);
  };

  // generic error handler
  export const genericErrHandler = async (err, req, res, next) => {
    if (err) {
      res.status(err.status || 500).json({
        message: err.message,
      });
    }
    next();
  };