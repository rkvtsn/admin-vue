<template>
  <div class="Settings">
    <h2>Параметры подключения к ПО НСС</h2>
    <nic-loader :is-loading="isLoading">
      <nic-form @submit="submit"
                :autoheight="false">
        <nic-input label="Имя пользователя"
                   :maxlength="32"
                   :validation="settings.$validator[`${key.USERNAME}.value`]"
                   v-model="settings[key.USERNAME].value" />

        <nic-input type="password"
                   label="Пароль"
                   :maxlength="255"
                   :validation="settings.$validator[`${key.PASSWORD}.value`]"
                   v-model="settings[key.PASSWORD].value" />

        <nic-input label="Адрес сервера"
                   :maxlength="255"
                   :validation="settings.$validator[`${key.URL}.value`]"
                   v-model="settings[key.URL].value" />

        <div slot="footer">
          <div class="NicForm__BottomToolbar">
            <button :disabled="!settings.$validator.isValid"
                    type="submit"
                    class="btn btn-primary">Сохранить</button>
            <button :disabled="!settings.$validator.isValid || testIsLoading"
                    class="btn btn-default"
                    @click.prevent="testRequest">{{ testIsLoading ? 'Ожидание' : 'Тест' }}</button>
            <button class="btn btn-default"
                    @click.prevent="loadSettings">Сброс</button>
          </div>
        </div>
      </nic-form>
    </nic-loader>

  </div>

</template>


<script>
import { SettingsNss, key } from '../models/SettingsNss';
import API from '@/js/addons/api';

export default {
  data() {
    return {
      settings: new SettingsNss(),
      isLoading: false,
      testIsLoading: false,
      api: new API('nss'),
    };
  },
  methods: {
    submit() {
      let settings = [
        this.settings[key.URL],
        this.settings[key.USERNAME],
        this.settings[key.PASSWORD]
      ];
      this.isLoading = true;
      this.$store.dispatch('saveSettings', settings).then(() => this.isLoading = false);
    },
    testRequest() {
      this.testIsLoading = true;
      this.api.request('test', {
        data: {
          username: this.settings[key.USERNAME].value,
          password: this.settings[key.PASSWORD].value,
          url: this.settings[key.URL].value,
        }
      }).then(({ result }) => {
        if (result) {
          this.$notify.success('Успешно выполнен тестовый запрос');
        } else {
          this.$notify.error('Не выполнен тестовый запрос');
        }
      }).finally(() => {
        this.testIsLoading = false;
      });
    },
    loadSettings() {
      this.isLoading = true;
      this.$store
        .dispatch('findSettings', [
          key.URL,
          key.USERNAME,
          key.PASSWORD,
        ])
        .then(r => {
          let settings = {};
          if (r.data) {
            for (let i = 0; i < r.data.length; i++) {
              settings[r.data[i].key] = r.data[i];
            }
          }
          this.settings.$reset(settings);
          this.isLoading = false;
        }).catch(e => {
          this.isLoading = false;
        });
    }
  },
  created() {
    this.key = key;
    this.loadSettings();
  }
};
</script>
