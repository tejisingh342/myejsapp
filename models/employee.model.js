const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: {type: String, required:true},
  email: {type: String, required:true},
  etype: {type: String, required:true},
  hourlyRate: {type: Number, required:true},
  totalHour: {type: Number, required:true},
  total: {type : Number},
});

mongoose.model("EmployeeData", employeeSchema);
