var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bcrypt = require('bcryptjs');

module.exports = function (passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.getUserById(id, function(err, user) {
            done(err, user);
        });
    });

    // Login
    passport.use('local-login', new LocalStrategy({
        passReqToCallback: true
    },
    function (req, username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) {
                return done(err);
            }
            // Does User exists
            if (!user) {
                req.flash('error_message', 'User Not Found');
                return done(null, false);
            }
            // Is Password Valid
            if (!isValidPassword(user, password)) {
                req.flash('error_message', 'Invalid Password');
                return done(null, false);
            }
            req.flash('success_message', 'You are now logged in');
            return done(null, user);
        });
    }));


    // Register
    passport.use('local-register', new LocalStrategy({
        passReqToCallback: true
    },
        function (req, username, password, done) {
            findOrCreateUser = function () {
                // Find a user with the username
                User.findOne({username: username}, function (err, user) {
                    if (err) {
                        console.log('Error: ' + err);
                        return done(err);
                    }
                    // Does user exists
                    if (user) {
                        console.log('That user already exists');
                        return done(null, false, req.flash('error_message', 'User already exists'));
                    }
                    else {
                        var newUser = new User();

                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');
                        newUser.name = req.param('name');
                        newUser.join_date = new Date();

                        // Add User
                        User.addUser(newUser, function (err, user) {
                            if (err) {
                                console.log('Error: ' + err);
                                throw err;
                            }
                            else {
                                req.flash('success_message','You are now registered and logged in');
                                return done(null, newUser);
                            }
                        });
                    }
                });
            };
            process.nextTick(findOrCreateUser);
        }
    ));

    var isValidPassword = function (user, password) {
        return bcrypt.compareSync(password, user.password);
    };

    var createHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    }
};
