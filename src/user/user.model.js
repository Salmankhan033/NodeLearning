import mongoose from "mongoose";
import UserRoleEnum from "./user.enum.js";
let UserSchema = mongoose.Schema({
  userName: { type: String, default: "" },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  DOB: { type: String, default: "" },
  profile: { type: String, default: "" },
  email: { type: String, default: "" },
  password: { type: String, default: "" },
  phone: { type: String, default: "" },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  userType: {
    type: String,
    default: UserRoleEnum.SUPER_ADMIN,
    enum: UserRoleEnum,
  }, // user, admin , superAdmin
  latitude: { type: Number, default: 0 },
  logitude: { type: Number, default: 0 },
  address1: { type: String, default: "" },
  address2: { type: String, default: "" },
  city: { type: String, default: "" },
  passportNo: { type: String, default: "" },
  cnic: { type: String, default: "" },
  createdDate: { type: String, default: new Date() },
  deletionDate: { type: String, default: "" },
});

let User = mongoose.model("users", UserSchema);
export default User;
