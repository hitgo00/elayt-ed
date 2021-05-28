const router = require('express').Router();
// const router = express.Router();
// const mongoose = require('mongoose');

// @get /
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Elayted Server | 200 OK | @meet59patel @hitgo00',
  });
});

module.exports = router;
