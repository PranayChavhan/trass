import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function register(req, res) {
  try {
    const { username, password, firstName, lastName, email, profile } = req.body;
    const existUsername = UserModel.findOne({ username });
    const existEmail = UserModel.findOne({ email });

    const [existingUsername, existingEmail] = await Promise.all([existUsername, existEmail]);

    if (existingUsername) {
      return res.status(400).json({ error: "Please use a unique username" });
    }

    if (existingEmail) {
      return res.status(400).json({ error: "Please use a unique email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      profile: {
        profile_photo: profile?.profile_photo || "",
        background_img: profile?.background_img || "",
        aka_name: profile?.aka_name || "",
        occupation: profile?.occupation || "",
        intro: profile?.intro || "",
        qualification: profile?.qualification || "",
        achievements: {
          image: profile.achievements.image || "",
          title: profile.achievements.title || "",
          description: profile.achievements.description || "",
        },
        social_media: {
          linkedin: profile?.social_media?.linkedin || "",
          instagram: profile?.social_media?.instagram || "",
        },
      },
    });
    const savedUser = await user.save();

    res.status(201).json({ msg: `User registered successfully, userId is ${savedUser._id}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export async function login(req, res) {
  try {
    const { usernameOrEmail, password } = req.body;

    // Check if the usernameOrEmail exists in the database
    const user = await UserModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or email" });
    }

    // Compare the entered password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET, // Replace with your actual secret
      { expiresIn: "24h" }
    );

    // Return success along with the token
    res.status(200).json({
      msg: "Login Successful",
      username: user.username,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getUser(req, res) {
  const { username } = req.params;
  try {
    if (!username) return res.status(501).send({ error: "Invalid Username" });

    UserModel.findOne({ username }, function (err, user) {
      if (err) return res.status(500).send({ err });
      if (!user)
        return res.status(501).send({ error: "Couldn't Find the User" });
      const { password, ...rest } = Object.assign({}, user.toJSON());

      return res.status(201).send(rest);
    });
  } catch (error) {
    return res.status(404).send({ error: "Cannot Find User Data" });
  }
}

export async function updateUser(req, res) {
  try {
    const { userId } = req.body;
    if (userId) {
      const body = req.body;
      UserModel.updateOne({ _id: userId }, body, function (err, data) {
        if (err) throw err;
        return res.status(201).send({ msg: "Record Updated...!" });
      });
    } else {
      return res.status(401).send({ error: "User Not Found...!" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}

export async function deleteUser(req, res) {
  try {
    const { userId } = req.params;

    if (userId) {
      UserModel.deleteOne({ _id: userId }, function (err, data) {
        if (err) throw err;

        return res.status(201).send({ msg: "Record Deleted...!" });
      });
    } else {
      return res.status(401).send({ error: "User Not Found...!" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}
