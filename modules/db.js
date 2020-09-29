const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  etype: String,
  hourlyRate: Number,
  totalHour: Number,
  total: Number,
});

employeeSchema.methods.totalSalary = () => {
  return this.hourlyRate * this.totalHour;
};

const employeeModel = mongoose.model("EmployeeData", employeeSchema);

module.exports = employeeModel;
