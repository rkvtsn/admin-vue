import { Model } from '@/js/models/';
import { required, same, optional } from '@/js/addons/validation';


class User extends Model {
  get $defaultValue() {
    return {
      id: null,
      fullName: '',
      userName: '',
      password: '',
      repassword: '',
      roleList: []
    };
  }

  get $vRules() {
    return {
      userName: [required()],
      fullName: [required()],
      password: [optional([required()], () => !this.id), same({src: () => this.repassword, fieldName: 'Подтверждение пароля'})],
      repassword: [optional([required()], () => !this.id), same({src: () => this.password, fieldName: 'Пароль'})],
    };
  }
}

export default User;
