const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let User;
try {
  const models = require('../models');
  User = models.User;
} catch (e) {
  User = null;
}

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!User || !User.create) {
      return res.status(201).json({
        message: 'User registered successfully (Simulasi DB)',
        user: { id: 1, username, email }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(400).json({ error: 'Username or Email already registered' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!User || !User.findOne) {
      const token = jwt.sign(
        { email: email || 'salman@gmail.com', username: 'salman' },
        process.env.JWT_SECRET || 'mysupersecretkey123',
        { expiresIn: '1d' }
      );
      return res.json({ message: 'Login successful (Simulasi DB)', token });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'mysupersecretkey123',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};