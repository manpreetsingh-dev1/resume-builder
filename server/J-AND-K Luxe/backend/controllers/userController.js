import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs"
import { verifyEmail } from "../emailverify/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../emailverify/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    console.log(req.body);

    const { firstName, lastName, email, password } = req.body;

    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !password?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "user already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Hashed:", hashedPassword);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "10m" })
    verifyEmail(token, email)  //send email here

    newUser.token = token

    return res.status(201).json({
      success: true,
      message: "user registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verify = async (req, res) => {

  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(400).json({
        success: false,
        message: "authorization token is missing or invalid",
      });

    }
    const token = authHeader.split(" ")[1] //bearer,fcgmbk789
    let decoded
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY)
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration token ha expired",
        });
      }
      return res.status(400).json({
        success: false,
        message: "Token verification Failed",
      });
    }
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    user.token = null
    user.isVerified = true
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
}

export const reVerify = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "10m" })
    verifyEmail(token, email) //send email here
    user.token = token
    await user.save()
    return res.status(200).json({
      success: true,
      message: "verification email sent again successfully",
      token: user.token
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
export const login = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    } const existingUser = await User.findOne({ email })
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "user not exist",
      });

    }
    const isPasswordValid = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "invalid Credentials",
      });

    }
    if (existingUser.isVerified === false) {
      return res.status(400).json({
        success: false,
        message: "verify your acoount than login",
      });

    }
    // generate token
    const accessToken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: "10d" })
    const refreshToken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: "30d" })

    existingUser.isLoggedIn = true
    await existingUser.save()

    //check for existing sesion and delete it
    const existingSession = await Session.findOne({ userId: existingUser._id })
    if (existingSession) {
      await Session.deleteOne({ userId: existingUser._id })

    }
    //create new session
    await Session.create({ userId: existingUser._id })
    return res.status(200).json({
      success: true,
      message: `welcome back ${existingUser.firstName}`,
      user: existingUser,
      accessToken,
      refreshToken
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const logout = async (req, res) => {
  try {
    const userId = req.id
    await Session.deleteMany({ userId: userId })
    await User.findByIdAndUpdate(userId, { isLoggedIn: false })
    return res.status(200).json({
      success: true,
      message: "user logged Out successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found"
      })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
    user.otp = otp
    user.otpExpiry = otpExpiry

    await user.save()

    await sendOTPMail(otp, email)

    return res.status(200).json({
      success: true,
      message: "otp sent to your email successfully "
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const email = req.params.email;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "otp is required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found"
      });
    }

    // ✅ FIXED CONDITION
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "otp is not generated or already verified"
      });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "otp has expired please request for new one"
      });
    }

    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "otp is invalid"
      });
    }

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "otp is verified successfully"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body
    const { email } = req.params
    const user = await User.findOne({ email })
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "user not found"
      })

    }
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "all fields are required"
      })

    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password do not match"
      })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword
    await user.save()
    return res.status(500).json({
      success: true,
      message: "password changed successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const allUser = async (_, res) => {
  try {
    const users = await User.find()
    return res.status(200).json({
      success: true,
      users
    })

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    })

  }
}
export const getuserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password -otp -otpExpiry -token")

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found"
      })

    }
    return res.status(200).json({
      success: true,
      user
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })

  }
}

// export const updateUser = async (req, res) => {
//   try {
//     const userIdToUpdate = req.params.id
//     const loggedInUser = req.user
//     const { firstName, lastName, address, city, zipCode, phoneNo, role } = req.body

//     if (!loggedInUser) {
//   return res.status(401).json({
//     success: false,
//     message: "Unauthorized - user not logged in",
//   });
// }
//     let user = await User.findById(userIdToUpdate);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "user mot found"
//       })

//     }
//     let profilePicUrl = user.profilePic;
//     let profilePicPublicId = user.profilePicPublicId;

//     // if a new file is uploaded
//     if (req.file) {
//       if (profilePicPublicId) {
//         await cloudinary.uploader.destroy(profilePicPublicId)
//       }
//       const uploadResult = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "profiles" },
//           (error, result) => {
//             if (error) reject(error)
//             else resolve(result)

//           }
//         )
//         stream.end(req.file.buffer)
//       })
//       profilePicUrl = uploadResult.secure_url;
//       profilePicPublicId = uploadResult.public_id
//     }

//     // update Fields
//     user.firstName = firstName || user.firstName;
// user.lastName = lastName || user.lastName;
// user.address = address || user.address;
// user.city = city || user.city;
// user.zipCode = zipCode || user.zipCode;
// user.phoneNo = phoneNo || user.phoneNo;
// if (role) user.role = role;
// user.profilePic = profilePicUrl;
// user.profilePicPublicId = profilePicPublicId;

// const updatedUser = await user.save();

// return res.status(200).json({
//   success: true,
//   message: "Profile Updated Successfully",
//   user: updatedUser
// });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message
//     })
//   }
// }


// chatgpt updateUser
export const updateUser = async (req, res) => {
  try {
    const userIdToUpdate = req.params.id;
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { firstName, lastName, address, city, zipCode, phoneNo, role } = req.body;

    if (
      loggedInUser._id.toString() !== userIdToUpdate &&
      loggedInUser.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "you are not allowed to update this profile",
      });
    }

    let user = await User.findById(userIdToUpdate);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    let profilePicUrl = user.profilePic;
    let profilePicPublicId = user.profilePicPublicId;

    if (req.file) {
      if (profilePicPublicId) {
        await cloudinary.uploader.destroy(profilePicPublicId);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      profilePicUrl = uploadResult.secure_url;
      profilePicPublicId = uploadResult.public_id;
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    user.phoneNo = phoneNo || user.phoneNo;
    if (role) user.role = role;

    user.profilePic = profilePicUrl;
    user.profilePicPublicId = profilePicPublicId;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.log("ERROR:", error); // 🔥 add this
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};