var express = require("express");
const db = require("../modules/db");
var router = express.Router();
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "MyEjsApp" });
});

//LOAD "EMPLOYEE DATA" VIEW
router.get("/employeeData", (req, res) => {
  res.render("employee/employee_data", {
    title: "Employee Records",
    css: ["employee/employee_data"],
    js: ["employee/employee_data"],
  });
});

// GET EMPLOYEE DATA
router.post("/employeeData", (req, res) => {
  db.find()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
module.exports = router;
