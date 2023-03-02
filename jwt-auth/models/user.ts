import { Document, Model, model, Schema, models } from "mongoose";
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
  id: string;
}

// Define the user document interface (extends the user interface and adds the id and timestamps properties)
export interface UserDocument extends User, Document {
  logProperties(): void;
  getUserProperties(): User;
  sanitize(): SanitizedUser;
}

// Define the user model interface (extends the user interface and adds static methods)
export interface UserModel extends Model<UserDocument> {
  findByEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserDocument | null>;
  isDuplicateEmail(email: string): Promise<boolean>;
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

// Add method to check if an user with the given email exists
userSchema.statics.isDuplicateEmail = async function (
  email: string
): Promise<boolean> {
  const user = await this.findOne({ email }).exec();
  return !!user;
};

// create method that returns the user properties
userSchema.methods.getUserProperties = function (): User {
  return {
    ...this,
    username: this.username,
    email: this.email,
    role: this.role,
    password: this.password,
  };
};

userSchema.methods.sanitize = function (): SanitizedUser {
  const { password, _id, ...rest } = this.toJSON();
  rest.id = _id;
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

// Export the model if it exists, otherwise create the model and then export it
const User =
  (models.User as UserModel) ||
  model<UserDocument, UserModel>("User", userSchema);

export default User;
