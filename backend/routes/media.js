const express = require('express');
const { serveMedia } = require('../utils/media');

const router = express.Router();

router.get('/:id', (req, res, next) => {
  serveMedia(req, res, next, req.params.id);
});

module.exports = router;
