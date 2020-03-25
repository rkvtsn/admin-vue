import {
  Model
} from '@/js/models/';
import {
  required
} from '@/js/addons/validation';


class Role extends Model {
  get $defaultValue() {
    return {
      id: null,
      name: '',
      comment: '',
      rightList: []
    };
  }

  get $vRules() {
    return {
      name: [required()]
    };
  }
}

export default Role;
