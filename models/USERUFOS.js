const mongoose = require("mongoose");
const { Schema } = mongoose;

//datetime dosnt quite get parsed right in javascript so treated as a string not Date object
const ufoSchema = new Schema(
  {
    datetime: String,
    city: String,
    state: String,
    country: String,
    shape: String,
    durationseconds: String,
    durationhoursmin: String,
    comments: String,
    dateposted: String,
    latitude: Number,
    longitude: Number,
  },
  { timestamps: true }
);