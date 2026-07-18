import ModelProxy from './modelFactory.js';

const userSchemaDefinition = {
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'client', enum: ['client', 'admin'] },
  isSuspended: { type: Boolean, default: false },
  contactDetails: { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  address: { type: String, default: '' }
};

const User = new ModelProxy('User', userSchemaDefinition, 'users');

export default User;
