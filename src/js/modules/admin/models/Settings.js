import { ModelValid } from '@/js/models/';
import { required, range } from '@/js/addons/validation';


class Settings extends ModelValid {
  get $defaultValue() {
    return {
      notify_userName: {
        key: 'notify_userName',
        value: null,
        id: null,
        uuid: null
      },
      notify_password: {
        key: 'notify_password',
        value: null,
        id: null,
        uuid: null
      },
      notify_hostname: {
        key: 'notify_hostname',
        value: null,
        id: null,
        uuid: null
      }
    };
  }

  get $vRules() {
    return {
      'notify_userName.value': [required(), range({max:32})],
      'notify_password.value': [required(), range({max:255})],
      'notify_hostname.value': [required(), range({max:255})]
    };
  }
}

export default Settings;
