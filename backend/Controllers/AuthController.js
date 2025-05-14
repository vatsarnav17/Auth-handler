const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/user'); // Ensure the correct import

const signup = async (req, res) => {
  try {

    console.log(req.body);  // Log the incoming signup data for debugging

    const { name, email, location, password} = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409)
        .json({ message: 'User already exists, you can login.', success: false });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, location, password: hashedPassword });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'Signup successful', success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Debugging: Log the incoming login request
    console.log('Login request received:', req.body);

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email); // Debugging line
      return res.status(403).json({ message: 'Authentication failed. Email or password wrong!', success: false });
    }

    // Compare the provided password with the stored hashed password
    const isPassEqual = await bcrypt.compare(password, user.password);

    // Debugging: Log the result of the password comparison
    console.log('Password comparison result:', isPassEqual); // Debugging line

    if (!isPassEqual) {
      return res.status(403).json({ message: 'Authentication failed. Email or password wrong!', success: false });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Debugging: Log the successful login
    console.log('Login successful for user:', user.email);

    res.status(200).json({
      message: 'Login successful',
      success: true,
      jwtToken,
      email,
      name: user.name,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};

module.exports = {
  signup,
  login
};
