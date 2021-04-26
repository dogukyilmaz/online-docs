import { Schema, model, Document } from "mongoose";
import { genSalt, hash } from "bcryptjs";

export interface BaseUser {
  name: string;
  password: string;
  email: string;
}

export type User = BaseUser & Document;

const UserSchema = new Schema(
  {
    name: { type: String, required: [true, "Name is required!"] },
    password: { type: String, select: false, required: [true, "Password is required!"] },
    email: { type: String, unique: true, required: [true, "Email is required!"] },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt before save
UserSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) next();

  const salt = await genSalt(10); // Generated Salt
  this.password = await hash(this.password.toString(), salt); // Hashed password
  next();
});

// Lowercase email
UserSchema.pre<User>("save", function (next) {
  this.name = this.name.toLowerCase();
  next();
});

// Tranforms the first characters of each names
UserSchema.pre<User>("save", function (next) {
  let tempName = "";
  this.name
    .trim()
    .split(" ")
    .forEach((el) => (tempName += el.charAt(0).toUpperCase() + el.slice(1) + " "));
  this.name = tempName.trim();
  next();
});

export default model<User>("User", UserSchema);
