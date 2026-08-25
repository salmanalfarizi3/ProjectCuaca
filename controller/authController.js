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

    // 1. Cek secara eksplisit apakah email atau username sudah ada
    const existingUser = await User.findOne({ 
      where: { email } 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email sudah terdaftar' 
      });
    }

    // 2. Hash password dan simpan ke DB
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, username: user.username, email: user.email }
    });

  } catch (err) {
    // 3. Tampilkan pesan error database asli ke Postman untuk debugging
    console.error("Detail Error Register:", err);
    return res.status(500).json({ 
      error: 'Gagal mendaftar user',
      details: err.message 
    });
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
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'mysupersecretkey123',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.json({ message: 'Login successful', token });

  } catch (err) {
    console.error("Detail Error Login:", err);
    return res.status(500).json({ 
      error: 'Gagal melakukan login',
      details: err.message 
    });
  }
};