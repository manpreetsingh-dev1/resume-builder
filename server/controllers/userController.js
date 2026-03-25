import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import Resume from "../models/Resume.js";

const normalizeResume = (resume) => {
    if (!resume) {
        return resume;
    }

    const normalizedResume =
        typeof resume.toObject === "function" ? resume.toObject() : { ...resume };

    normalizedResume.professional_summary =
        typeof normalizedResume.professional_summary === "string"
            ? normalizedResume.professional_summary
            : "";

    return normalizedResume;
};

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
    return token;
}

// controler for user register
// POST:/api/users/register

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // check if reqiured field are present
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required Fields' })
        }
        // check if user already exist
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: 'User already exist' })
 
        }
        // create new user
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name, email, password: hashedPassword
        })

        // return success message
        const token = generateToken(newUser._id)
        newUser.password = undefined;

        return res.status(201).json({ message: 'User created successfully', token, user: newUser })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })

    }
}

// controler for user login
// POST:/api/users/login

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if user  exist
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'invalid email or password' })

        }

        // check if password is correct
        const isMatch = await user.comparePassword(password);

if (!isMatch) {
  return res.status(400).json({ message: 'invalid email or password' });
}
        // return success message

        const token = generateToken(user._id)
        user.password = undefined;

        return res.status(200).json({ message: 'login successfully', token, user: user })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })

    }
}

// controller for getting user by id
// GET :/api/users/data

export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;
        // check if user exist
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({ message: 'user not found' })
        }
        user.password = undefined;
        return res.status(200).json({ user })

    }
    catch (error) {
        return res.status(500).json({ message: error.message })

    }
}
// controller for getting user resumes
// GET /api/users/resumes

export const getUserResumes=async(req,res)=>{
    try {
        const userId=req.userId

        // return user resumes
const resumes= await Resume.find({userId}).sort({ updatedAt: -1 })
return res.status(200).json({resumes: resumes.map(normalizeResume)})
    } catch (error) {
    return res.status(500).json({ message: error.message })
}
}
