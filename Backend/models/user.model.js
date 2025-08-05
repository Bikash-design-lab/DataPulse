const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, min: 4, required: true },
        role: {
            type: String,
            enum: ["Admin", "Employee"],
            default: "Employee",
        }
    },
    { versionKey: false, timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel };
