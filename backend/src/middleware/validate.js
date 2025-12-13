const { validationResult } = require('express-validator');

function validate(rules) {
  return async (req, res, next) => {
    for (const rule of rules) {
      await rule.run(req);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: 'Validation failed', errors: errors.array() });
    }
    next();
  };
}

module.exports = { validate };
