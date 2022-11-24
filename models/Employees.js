const mongoose = require("mongoose");

const { employeeRoles } = require("../constants/enums");

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const EmployeesSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    employees: {
      type: [
        {
          fullname: {
            type: String,
            required: true,
          },
          email: {
            type: String,
            required: true,
            max: 50,
          },
          phone: {
            type: String,
            required: true,
            min: 10,
          },
          role: {
            type: String,
            required: true,
            enum: {
              values: Object.values(employeeRoles),
            },
            default: employeeRoles.helper,
          },
          rate: {
            type: Number,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employees", EmployeesSchema);
