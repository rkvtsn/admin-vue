import User from './User.js';
import Role from './Role.js';
import Settings from './Settings.js';
import SystemInformation from './SystemInformation.js';
import HelpItem from './HelpItem.js';

const models = {
  admin: {
    User,
    Role,
    Settings,
    SystemInformation,
    HelpItem,
  }
};

export default models;

export {
  User,
  Role,
  Settings,
  SystemInformation,
  HelpItem,
};
