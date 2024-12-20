//===================================================================
// User model 
//===================================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, default: 'Untitled Assignment'},
  dueDate: { type: Date },
  points: { type: Number, default: 100 },
  submitted: { type: Boolean, default: false }
});

const ClassSchema = new mongoose.Schema({
  className: String,
  grade: String,
  cid: { type: String, default: '' }, // Course ID code
  assignments: [AssignmentSchema]
});

const HealthcareSchema = new mongoose.Schema({
  labResults: [
    {
      date: { type: Date, default: Date.now },
      testName: String,
      result: String
    }
  ],
  medications: [
    {
      name: String,
      dosage: String,
      frequency: String
    }
  ],
  allergies: [String],
  immunizations: [
    {
      name: String,
      date: { type: Date, default: Date.now }
    }
  ],
  doctorsNotes: [
    {
      date: { type: Date, default: Date.now },
      note: String,
      doctorId: String
    }
  ],
  procedures: [
    {
      name: String,
      date: { type: Date, default: Date.now },
      notes: String
    }
  ],
  appointments: [
    {
      date: { type: Date, default: Date.now },
      type: String, // "Checkup", "Follow-up", "eVisit", etc.
      status: { type: String, default: "Pending" },
      doctorId: String
    }
  ],
  careTeam: [
    {
      udisId: String,
      name: String,
      avatarPicture: String
    }
  ],
  appointmentRequests: [
    {
      patientUdisId: String,
      doctorUdisId: String,
      description: String,
      status: { type: String, default: 'Pending' },
      date: { type: Date, default: Date.now }
    }
  ]
});

const UserSchema = new mongoose.Schema({
  udisId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  lastName: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthdate: { type: String, required: true },
  role: { type: String, default: 'Citizen' },
  consent: { type: Boolean, default: false },
  issuingAuthority: { type: String, default: 'UDIS SYSTEMS' },
  pictureId: { type: String, default: '' },
  phone: { type: String, default: '' },
  avatarPicture: { type: String, default: '' },
  education: {
    major: { type: String, default: '' },
    classes: [ClassSchema]
  },
  healthcare: { type: HealthcareSchema, default: {} },
  recentInteractions: {
    healthcare: [
      {
        udisId: String,
        name: String,
        avatarPicture: String
      }
    ],
    education: [
      {
        udisId: String,
        name: String,
        avatarPicture: String
      }
    ],
    finance: [
      {
        udisId: String,
        name: String,
        avatarPicture: String
      }
    ]
  }
});

// Password hashing middleware
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  console.log('[UserSchema] Hashing password...');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log('[UserSchema] Password hashed.');
  next();
});

// Password comparison method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;