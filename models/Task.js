const mongoose = require("mongoose");
const timestamps = require("mongoose-timestamp");
const Joi = require("joi");

var TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, require: false },

  // multiple files path store in database Start
  multipleFileName: [{ type: Array, require: false }],
  multipleFilePath: [{ type: Array, requre: false }],
  // multiple files path store in database End

  //column_title or TASK_STATUS..
  column_title: { type: String, require: false },
  expireAt: { type: Date, required: false },
  label: { type: String, required: false },
  labelType: {
    type: String,
    enum: ["danger", "warning", "primary", "info", "dark", "success"],
    required: false,
  },
});
// Auto Timestamp for createdAt, updatedAt
TaskSchema.plugin(timestamps);

TaskSchema.methods.joiValidate = (obj) => {
  const taskSchema = Joi.object({
    title: Joi.string().min(3).max(60).required(),
    column_id: Joi.string(),
    description: Joi.string(),

    // multiple files path store in database Start
    multipleFileName: Joi.array(),
    multipleFilePath: Joi.array(),
    // multiple files path store in database End

    //column_title or TASK_STATUS..
    column_title: Joi.string(),
    expireAt: Joi.date(),
    label: Joi.string().min(3).max(15),
    labelType: Joi.string().valid(
      "danger",
      "warning",
      "primary",
      "success",
      "info",
      "dark"
    ),
  });
  return Joi.validate(obj, taskSchema);
};

var Task = mongoose.model("Task", TaskSchema);

exports.Task = Task;
