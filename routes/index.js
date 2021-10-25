var express = require('express');
var router = express.Router();

const MemberModifyMethod = require('../controllers/member/modify_controller')

memberModifyMethod = new MemberModifyMethod()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: "Welcome to the home page."})
});

// Get Register page

// Post Register page
router.post('/member', memberModifyMethod.postRegister)
// Get Login page

// Post Login page
router.post('/member/login', memberModifyMethod.postLogin)

// Put Update
router.put('/member', memberModifyMethod.putUpdate)

// Pust Update image
router.put('/updateimage', memberModifyMethod.putUpdateImage)
module.exports = router
