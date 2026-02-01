const mongoose = require("mongoose");

// 👇 IMPORTANT FIX
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

// ✅ correct usage
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
