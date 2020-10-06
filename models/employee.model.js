const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  etype: String,
  hourlyRate: Number,
  totalHour: Number,
  total: Number,
});

employeeSchema.methods.totalSalaray = () => {
  return this.hourlyRate * this.totalHour;
};

mongoose.model("EmployeeData", employeeSchema);
