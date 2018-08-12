const router = require('express').Router();
const db = require("../models/");

const authCheck = (req, res, next) => {
  if(!req.user) {
    res.redirect('/auth/login'); 
  }
  else {
    next(); 
  }
}

router.get('/', authCheck, (req, res) => {
  console.log(req.user.dataValues);
  res.render('userHome', req.user.dataValues);
});

router.put('/update', authCheck, (req, res) => {
  const id = req.user.dataValues.id;
  db.User.update({
    player_funds: req.body.funds
  }, {
    where: {
      id: id
    }
  }).then(function(result) {
    res.json(result);
  });
});

router.put('/resetfunds', authCheck, (req, res) => {
  const id = req.user.dataValues.id;
  db.User.update({
    player_funds: req.body.funds
  }, {
    where: {
      id: id
    }
  }).then(function(result) {
    res.json(result);
  });
});

module.exports = router;