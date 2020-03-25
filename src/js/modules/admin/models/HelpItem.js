import { ModelApi} from '@/js/models/';
import { required } from '@/js/addons/validation';


class HelpItem extends ModelApi {

  get $controller() {
    return 'helps';
  }

  get $defaultValue() {
    return {
      id: null,
      itemKey: '',
      itemName: '',
      number: 0,
      htmlContent: ''
    };
  }

  get $vRules() {
    return {
      name: [required()]
    };
  }
}

export default HelpItem;
