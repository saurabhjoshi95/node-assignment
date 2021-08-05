const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res,next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      mobile: req.body.mobile,
      email: req.body.email,
      password: hash
    })
    user.save()
    .then(result => {
      res.status(201).json({
        message: "User created !",
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        message:"Invalid authentication credentials !"
      });
    });
  });
}

exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email}).then(user => {
      if(!user) {
        res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      console.log("user",result);
      if(!result) {
        res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
        "secret",
        {expiresIn: "1h"}
      );
      res.status(201).json({
        token:token,
        expiresIn: 3600
      });
    })
    .catch(err => {
      res.status(401).json({
        message: "Invalid authentication credentials !"
      });
    });
  }
  
  exports.updateUser = (req, res, next) => {
    const query = { _id: req.params.id };
    const newValues = { $set:{ firstName: req.body.firstName, lastName:req.body.lastName,
     mobileNo: req.body.mobileNo, address: req.body.address} };
     User.updateOne(query, newValues).then(result =>{
        if(result.n > 0) {
            res.status(200).json({message: "Update Successful !!"});
          } else {
            res.status(401).json({message: "Not Authorized !!"});
          }
     })
     .catch(err => {
         res.status(500).json({
             message:"Couldn't update User"
         });
     });
  }

  exports.listUsers = (req, res, next) => {
      const USERS_PER_PAGE = 100;
      const page = +req.query.page || 1;
      User.find()
      .skip((page - 1) * USERS_PER_PAGE)
      .limit(USERS_PER_PAGE)
      .then(users => {
          res.status(200).json({
              users: users
          })
      })
      .catch(err => {
          res.status(500).json({
              message: 'Users not found'
          })
      })
  }

  exports.searchUsers = (req, res, next) => {
    const USERS_PER_PAGE = 100;
    const page = +req.query.page || 1;
    const searchType = req.body.type;
    const searchData = req.body.data;
    const query = {};
    query[searchType] = searchData;
        User.find(query)
        .skip((page - 1) * USERS_PER_PAGE)
        .limit(USERS_PER_PAGE)
        .then(users => {
          res.status(200).json({
            users:users
          })
        })
        .catch(err => {
          res.status(500).json({
            message: "Couldn't find any result"
          })
        })
  }