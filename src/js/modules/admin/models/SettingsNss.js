import { ModelValid } from '@/js/models/';
import { required, range } from '@/js/addons/validation';

const USERNAME = 'nss_username';
const PASSWORD = 'nss_password';
const URL = 'nss_url';

class SettingsNss extends ModelValid {
  get $defaultValue() {
    return {
      [USERNAME]: {
        key: USERNAME,
        value: null,
        id: null,
        uuid: null
      },
      [PASSWORD]: {
        key: PASSWORD,
        value: null,
        id: null,
        uuid: null
      },
      [URL]: {
        key: URL,
        value: null,
        id: null,
        uuid: null
      }
    };
  }

  get $vRules() {
    return {
      [`${USERNAME}.value`]: [required(), range({ max: 32 })],
      [`${PASSWORD}.value`]: [required(), range({ max: 255 })],
      [`${URL}.value`]: [required(), range({ max: 255 })]
    };
  }
}

const key = {
  USERNAME,
  PASSWORD,
  URL
};

export default SettingsNss;
export {
  SettingsNss,
  key
};
