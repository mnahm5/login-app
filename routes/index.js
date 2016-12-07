var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Please Log in' });
});

router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Create an Account' });
});

router.get('/dashboard', function(req, res, next) {
    res.render('dashboard', {
        title: 'Dashboard',
        layout: 'dashboard_layout'
    });
});

module.exports = router;
