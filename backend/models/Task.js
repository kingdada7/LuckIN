import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "inProgress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachments: [
      {
        type: String,
      },
    ],

    progress: {
      type: Number,
      default: 0,
    },
    
    todoChecklist: [todoSchema],

       // 🔑 New field to isolate data per account/org
    organizationToken: {
      type: String,
      required: true,
      uppercase: true,
    },
  },

  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
