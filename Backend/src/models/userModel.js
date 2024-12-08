const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { ethers } = require("ethers");

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
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
    notifications: [notificationSchema],
    blockchainTxHash: {
      type: String,
      default: null, // To store the blockchain transaction hash
    },
    coins: {
      type: Number,
      default: 0, // Initial coin balance
    },
  },
  {
    timestamps: true,
  }
);

// Add matchPassword method to compare password hashes
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password is new or modified

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Blockchain Integration in pre-save hook
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") && !this.isNew) {
    return next();
  }

  const userHash = crypto
    .createHash("sha256")
    .update(`${this.email}${this.dob}${this.password}`)
    .digest("hex");

  const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
  const signer = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(
    process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
    ["function storeHash(string _dataHash) public"],
    signer
  );

  try {
    const tx = await contract.storeHash(userHash);
    const receipt = await tx.wait(); // Wait for the transaction to be confirmed
    this.blockchainTxHash = receipt.transactionHash; // Store the transaction hash
    next(); // Proceed with saving the user to MongoDB
  } catch (error) {
    console.error("Error storing hash on blockchain:", error);
    next(error); // Pass the error to the next middleware
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
