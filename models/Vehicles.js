const mongoose = require("mongoose");

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const VehiclesSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    vehicles: {
      type: [
        {
          number: {
            type: String,
            required: true,
            min: 2,
            max: 20,
          },
          capacity: {
            type: String,
            required: true,
            max: 50,
          },
          length: {
            type: Number,
            required: true,
            min: 10,
          },
          height: {
            type: String,
            required: false,
          },
          max_load: {
            type: Number,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Vehicles || mongoose.model("Vehicles", VehiclesSchema);
