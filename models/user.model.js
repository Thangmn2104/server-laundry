const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  address: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  courseIds: {
    type: [String],
    required: false
  },
  country: {
    type: String,
    required: false
  },
  image: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'], // Example roles
    required: true,
  },
  status: {
    type: String,
    enum: ['onboarding','completed'],
    require: true
  },

  // Teacher additional field
  certifications: {
    type: [String],
    required: false,
  },
  teaching_levels:{
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: false
  },
  bio: {
    type: String,
    required: false 
  },
  social_links: {
    type: [String],
    required: false
  }

}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Hash password before saving the user
UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

// Method to verify the password
UserSchema.methods.verifyPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
