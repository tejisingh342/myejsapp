var express = require("express");
const db = require("../modules/db");
var router = express.Router();
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("yess", { title: "MyEjsApp" });
});

// GET EMPLOYEE DATA
router.get("/employeeData", (req, res) => {
  db.find()
    .then((data) => {
      res.render("employee/employee_data", {
        title: "Employee Records",
        js: ["employee/employee_data"],
        css: ["employee/employee_data"],
        employee_records: data,
      });
    })
    .catch((err) => res.status(400).json("Error: " + err));
});
module.exports = router;
