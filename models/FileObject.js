const mongoose = require("mongoose");

const fileobjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    size: {
      type: Number,
      required: true,
      min: 128,
      max: 1024 * 1024 * 5,
    },

    mime: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const FileObjectModel = mongoose.model("FileObject", fileobjectSchema);

module.exports = FileObjectModel;
