const User = require("../models/user.js");


module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "welcom to wanderlust");
        res.redirect("/listings");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/signup");
    }
  };

module.exports.login = async (req, res) => {
    req.flash("success", "welcom back!");
    res.redirect(res.locals.redirectUrl || "/listings");
  };

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next();
    }
    req.flash("success", "your logged out");
    res.redirect("/listings");
  });
};

