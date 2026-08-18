const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required for creating user"],
            trim: true,
            lowercase: true,
            match: [emailRegex, "Please enter a valid email address"],
            unique: true
        },

        name: {
            type: String,
            required: [true, "Name is required for creating an account"]
        },

        password: {
            type: String,
            required: [true, "Password is required for creating account"],
            minlength: [6, "Password should contain more than 6 characters"],
            select: false
        },
        systemUser:{
            type:Boolean,
            default: false,
            immutable : true,
            select:false
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function() {
    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;