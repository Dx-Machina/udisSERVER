// roles.js

// Base roles
const BASE_ROLES = ['Citizen', 'Guest'];

// Employee roles
const EDUCATIONAL_EMPLOYEES = ['Teacher', 'Advisor', 'SchoolAdmin'];
const HEALTH_EMPLOYEES = ['Doctor', 'Nurse', 'Health Worker'];
const FINANCIAL_EMPLOYEES = ['Accountant', 'Bank Officer'];

// Administrative roles
const ADMIN_ROLES = ['Admin', 'Super Admin', 'Deus'];

// Composite roles
const EMPLOYEE_ROLES = [...EDUCATIONAL_EMPLOYEES, ...HEALTH_EMPLOYEES, ...FINANCIAL_EMPLOYEES];
const ALL_ROLES = [...BASE_ROLES, ...EMPLOYEE_ROLES, ...ADMIN_ROLES];

// Updated Permissions map
const ROLE_PERMISSIONS = {
  Citizen: { profile: ['read'], educationProfile: ['read'], healthProfile: ['read'], appointments: ['create']},
  Guest: { profile: ['read'] },
  
  Teacher: { educationProfile: ['read', 'update'], users: ['read'] },
  Advisor: { educationProfile: ['read', 'update'], users: ['read'] },
  SchoolAdmin: { educationProfile: ['read', 'update'], users: ['read'], healthProfile: ['read'] }, // ability to read immunizations, allergies, medications, etc.

  Doctor: { healthProfile: ['read', 'update'] },
  Nurse: { healthProfile: ['read', 'update'] },
  HealthWorker: { healthProfile: ['read', 'update'] },

  Accountant: { financialProfile: ['read', 'update'] },
  BankOfficer: { financialProfile: ['read', 'update'] },

  Admin: { users: ['create', 'read', 'update', 'delete'], educationProfile: ['read', 'update'] },
  SuperAdmin: { admin: ['create', 'read', 'update', 'delete'], educationProfile: ['read', 'update'] },
  Deus: { superAdmin: ['create', 'read', 'update', 'delete'], educationProfile: ['read', 'update'] },
};

module.exports = 
{
  BASE_ROLES,
  ADMIN_ROLES,
  EMPLOYEE_ROLES,
  ALL_ROLES,
  ROLE_PERMISSIONS,
};