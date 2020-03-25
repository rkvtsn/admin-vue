
<template>
  <div class="page_login">
    <div class="page_login__header">
      <h1>Сопровождение ФЦП "ГЛОНАСС"</h1>
      <h4>Программное обеспечение<br />формирования перспективной программы</h4>
    </div>
        <form class="page_login__form" autocomplete="off" @submit.prevent="logIn" :disabled="isLoading">
          <div class="form_header">Вход в систему</div>
          <div class="form-group">
            <label for="inputLogin" class="control-label">Имя пользователя:</label>
            <div>
              <input type="text" class="form-control" id="inputLogin" autocomplete="off"
                @input="userLogin.$validator.userName.$touch()"
                :class="{'error': userLogin.$validator.userName.error}"
                v-model.trim="userLogin.userName" placeholder="Имя пользователя">
              <span :key="key" v-for="(e, key) in userLogin.$validator.userName.errors" class="label label-danger">{{e}}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="inputPassword" class="control-label">Пароль:</label>
            <div>
              <input type="password" class="form-control" id="inputPassword" autocomplete="off"
                @input="userLogin.$validator.password.$touch()"
                :class="{'error': userLogin.$validator.password.error}"
                v-model.trim="userLogin.password" placeholder="Пароль">
              <span :key="key" v-for="(e, key) in userLogin.$validator.password.errors" class="label label-danger">{{e}}</span>
            </div>
          </div>

          <div class="form-group">
            <div class="checkbox">
                <label>
                  <input v-model="userLogin.isRememberMe" type="checkbox"> запомнить данные
                </label>
            </div>
          </div>

          <div>
            <button type="submit" :disabled="!userLogin.$validator.isValid" class="btn btn-default ButtonLoader">Войти</button>
          </div>
        </form>
  </div>
</template>

<script>
import { required } from '@/js/addons/validation';
import { ModelValid } from '@/js/models';

class Login extends ModelValid {

  get $defaultData() {
    return {
      userName: null,
      password: null,
      isRememberMe: false
    };
  }

  get $vRules() {
    return {
      userName: [required()],
      password: [required()]
    };
  }
}

export default {
  data: function() {
    return { userLogin: new Login() };
  },
  methods: {
    logIn: function() {
      this.$store.dispatch('login', this.userLogin).then(() => {
        this.$router.push('/');
        this.userLogin.$reset(this.$store.state.userAuthData);
      }).catch(() => {
        this.isRememberMe = false;
      });
    },
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
    errors() {
      return this.$store.getters.errors;
    },
    isLoading() {
      return this.$store.getters.isLoading;
    },
    validationErrors() {
      return this.$store.state.validationErrors;
    },
  },
  watch: {
    currentUser(value) {
      if (value !== null) {
        this.$router.push('/');
      }
    },
    errors(value) {
      if (value) { 
        this.$notify.error(value, {visibility: 7000});
      }
    }
  },
  created() {
    this.userLogin.$reset(this.$store.state.userAuthData);
    this.userLogin.$validator.$check();
  }
};

</script>
