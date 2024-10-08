const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false, // Notification unread by default
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // Notifications are embedded, so no separate _id is needed
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    mobileNo: {
      type: String,
      default: null,
    },
    dob: {
      type: Date,
      required: [true, "Date of Birth is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },
    category: {
      type: String,
      enum: ["UG", "PG", "School"],
      default: "UG",
    },
    cv: {
      type: String,
      default: null,
    },
    marksheet: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: "",
    },
    interests: {
      type: String,
      default: "",
    },
    grade: {
      type: String,
      default: "",
    },
    stream: {
      type: String,
      default: "",
    },
    notifications: [notificationSchema], // Array of notification objects
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash the password before saving it
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
