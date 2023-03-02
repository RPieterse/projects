import { Document, Model, model, Schema } from "mongoose";
import bcrypt from "bcrypt";

// Define the user interface
interface User {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface SanitizedUser {
  username: string;
  email: string;
  role: string;
}

// Define the user document interface (extends the user interface and adds the id and timestamps properties)
export interface UserDocument extends User, Document {
  logProperties(): void;
  getUserProperties(): User;
  sanitize(): SanitizedUser;
}

// Define the user model interface (extends the user interface and adds static methods)
interface UserModel extends Model<UserDocument> {
  findByEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserDocument>;
}

// Define the user schema
const userSchema = new Schema<UserDocument, UserModel>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user", "guest"],
    },
  },
  {
    timestamps: true,
  }
);

// Add methods to the user schema
userSchema.statics.findByEmailAndPassword = async function (
  email: string,
  password: string
): Promise<UserDocument> {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error("Invalid email address");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  return user;
};

// create method that returns the user properties
userSchema.methods.getUserProperties = function (): User {
  return {
    username: this.username,
    email: this.email,
    role: this.role,
    password: this.password,
  };
};

userSchema.methods.sanitize = function (): SanitizedUser {
  const { password, ...rest } = this.toJSON();
  return rest;
};

userSchema.methods.logProperties = function (): void {
  console.log(`User properties: ${JSON.stringify(this.toJSON())}`);
};

userSchema.pre<UserDocument>("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Define the user model
const User = model<UserDocument, UserModel>("User", userSchema);

export default User;
