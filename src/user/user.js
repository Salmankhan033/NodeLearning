import express from "express";
import User from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
let router = express.Router();
const authenticateToken = () => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(403).send({ message: "token not found" });
    } else {
      const token = authHeader.slice(7);
      console.log(token);
      jwt.verify(token, process.env.TOP_SECRET, (err) => {
        if (err) {
          return res.status(401).send({ message: "token is expire" });
        }
        next();
      });
    }
  };
};
//post user
router.post("/signup", async (req, res) => {
  try {
    let exist = await User.findOne({ email: req.body.email });
    if (!exist) {
      const hashPassword = await bcrypt.hash(req.body.password, 10);

      let result = await User.create({ ...req.body, password: hashPassword });
      const token = jwt.sign(
        { _id: result._id, email: result.email },
        process.env.TOP_SECRET,
        { expiresIn: process.env.EXPIRY_TIME }
      );
      // save user token
      result.password = "";

      return res.status(200).send({
        status: true,
        message: "Succsessfully added",
        data: { result, token },
      });
    }
    return res
      .status(400)
      .send({ status: false, message: "Email already exists" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

//TODO Check email and compared password of existing user and then login
router.post("/login", authenticateToken(), async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const comparePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (comparePassword) {
        const token = jwt.sign(
          { _id: user._id, email: user.email },
          process.env.TOP_SECRET,
          { expiresIn: process.env.EXPIRY_TIME }
        );
        user.password = "";
        return res.status(200).send({
          status: true,
          message: "login successfully",
          data: { user, token },
        });
      }
      return res
        .status(400)
        .send({ status: false, message: "Incorrect password" });
    }
    return res.status(400).send({ status: false, message: "Incorrect email" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
});

// get  all user
router.get("/", async (req, res) => {
  try {
    let result = await User.find({ password: 0 });
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// get user by id
router.get("/:id", async (req, res) => {
  try {
    let result = await User.findOne({ _id: req.params.id }, { password: 0 });
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// get updated user
router.put("/:id", async (req, res) => {
  try {
    let result = await User.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
});

//get delete user
router.delete("/:id", async (req, res) => {
  try {
    let result = await User.deleteOne({ _id: req.params.id });
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// search by name ,email, first name last name username
router.get("/search/:term", async (req, res) => {
  try {
    let result = await User.find(
      {
        $or: [
          {
            userName: req.params.term,
          },
          {
            email: req.params.term,
          },
          {
            firstName: req.params.term,
          },
          {
            lastName: req.params.term,
          },
        ],
      },
      { password: 0 }
    );
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default router;
