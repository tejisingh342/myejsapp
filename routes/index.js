const express = require("express");
const app = express();
const router = express.Router();
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
router.get("/employeeData", (req, res, next) => {
  res.render("employee/employee_data", {
    title: "Employee Records",
    css: ["employee/employee_data"],
    js: ["employee/employee_data"],
  });
});

// GET EMPLOYEE DATA
router.post("/employeeData", (req, res) => {
  Employee.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//INSERT AND UPDATE
// router.post()

module.exports = router;
