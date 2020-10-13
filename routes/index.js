const express = require("express");
const app = express();
const router = express.Router();
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Employee = mongoose.model("EmployeeData");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "MyEjsApp" });
});

/* SAMPLE PAGE */
router.get("/sample", (req, res) => {
  res.render("sample", {
    title: "Sample",
    css: ["sample"],
  });
});

//LOAD "EMPLOYEE DATA" VIEW
router.get("/employeeData", (req, res) => {
  res.render("employee/employee_data", {
    title: "Employee Records",
    css: ["employee/employee_data"],
    js: ["employee/employee_data"],
  });
});

// GET RECORDS
router.post("/employeeData", (req, res) => {
  Employee.find()
    .sort({ _id: -1 })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// INSERT AND UPDATE
router.post(
  "/insert_and_update",
  [
    check("name")
      .escape()
      .exists()
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage("Must be in between 2 to 30 chars")
      .matches(/^([A-Za-z]+\s)+[A-Za-z]+$|^[A-Za-z]+$/)
      .withMessage("Not Allowed."),
    // .isAlpha()
    // .withMessage("Only alphabets allowed.")
    check("email", "Invalid Email Address.")
      .exists()
      .normalizeEmail()
      .isEmail()
      .isLength({ max: 320 })
      .matches(/^[a-z0-9_?]+@[a-z]+\.[a-z]+$/)
      .withMessage("Invalid email address."),
    check("etype", "Please select employee type.").exists(),
    check("hourlyRate")
      .exists()
      .notEmpty()
      .withMessage("Hourly rate is required.")
      .isInt({ min: 1, max: 100000000 })
      .withMessage("This field must be number in between 1 and 100000000 ."),
    check("totalHour")
      .exists()
      .notEmpty()
      .withMessage("Total hour is required.")
      .isInt({ min: 0, max: 744 })
      .withMessage("This field must be number in between 0 to 744 ."),
  ],
  (req, res) => {
    try {
      validationResult(req).throw();
      console.log("start");
      console.log(req.body);
      req.body.total = req.body.hourlyRate * req.body.totalHour;
      const _id = req.body._id || new mongoose.Types.ObjectId();
      delete req.body._id;
      Employee.findOneAndUpdate({ _id }, req.body, {
        new: true,
        upsert: true,
      })
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(400).json("Error: " + err));
      /* const doc = new Employee(req.body);
      doc
        .save()
        .then((data) => res.status(201).json(data))
        .catch((err) => res.status(400).json("Error: " + err)); */
    } catch (err) {
      res.status(406).json(err.array({ onlyFirstError: true }));
    }
  },
);

// GET RECORD
router.post("/get_record", (req, res) => {
  Employee.findById(req.body._id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// DELETE RECORD
router.post("/delete_record", (req, res) => {
  res.status(200).json({ status: req.body._id });
});

module.exports = router;
