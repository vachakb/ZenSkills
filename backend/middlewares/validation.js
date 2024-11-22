exports.validation = (schemaCallback) => async (req, res, next) => {
  try {
    // setting abortEarly to false is needed because otherwise the validate
    // method will stop as soon as it finds the first error, while we want
    // to find all of them immediately
    const schema = schemaCallback(req);
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (e) {
    // return a 422 Unprocessable Content status code, plus the errors as JSON
    // data
    res.status(422).json({
      errors: e.inner.map((validationError) => ({
        field: validationError.path,
        message: validationError.message,
      })),
    });
    // here we use return to stop the middleware if an error is found, otherwise
    // it will go on and call the next() function
    return;
  }
};
