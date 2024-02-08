import jwt from "jsonwebtoken";

export default function Auth(req, res, next) {
  try {

    
    const token = req.headers.authorization.split(" ")[1];
    console.log('====================================');
    console.log(token);
    console.log('====================================');
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    
    const userId = decodedToken.userId;
    // console.log(req)
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: "Authentication Failed!" });
  }
}
