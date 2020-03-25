import {ModelApi} from '@/js/models/';

class SystemInformation extends ModelApi {
  get $controller() {
    return 'system';
  }

  get $defaultValue() {
    return {
      installDate: '',
      installPath: '',
      serviceName: '',
      pkNames: '',
      changelog: ''
    };
  }
}

export default SystemInformation;
