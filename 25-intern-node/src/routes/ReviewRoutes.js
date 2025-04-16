const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ReviewController');

router.post('/create', reviewController.createReview);
router.get('/doctor/:doctorId', reviewController.getDoctorReviews);

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const reviewController = require('../controllers/ReviewController');

// router.post('/create', reviewController.createReview);
// router.get('/doctor/:doctorId', reviewController.getDoctorReviews);
// router.get('/doctor/:doctorId/summary', reviewController.getRatingSummary);
// router.get('/top-rated', reviewController.getTopRatedDoctors);

// module.exports = router;