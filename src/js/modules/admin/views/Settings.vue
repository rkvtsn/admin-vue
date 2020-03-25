<template>
  <div class="Settings">
    <h2>Параметры подключения к ПО ССМП</h2>
    <nic-loader :is-loading="isLoading">
      <nic-form @submit="submit"
                :autoheight="false">
        <nic-input label="Имя пользователя"
                   :maxlength="32"
                   :validation="settings.$validator['notify_userName.value']"
                   v-model="settings.notify_userName.value" />

        <nic-input type="password"
                   label="Пароль"
                   :maxlength="255"
                   :validation="settings.$validator['notify_password.value']"
                   v-model="settings.notify_password.value" />

        <nic-input label="Адрес сервера"
                   :maxlength="255"
                   :validation="settings.$validator['notify_hostname.value']"
                   v-model="settings.notify_hostname.value" />

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
import models from '@/js/models';

export default {
  data() {
    return {
      settings: new models.admin.Settings(),
      isLoading: false,
      testIsLoading: false
    };
  },
  methods: {
    submit() {
      let settings = [
        this.settings.notify_hostname,
        this.settings.notify_userName,
        this.settings.notify_password
      ];
      this.isLoading = true;
      this.$store.dispatch('saveSettings', settings).then(() => this.isLoading = false);
    },
    testRequest() {
      this.testIsLoading = true;
      let url = this.settings.notify_hostname.value + '/api/fcp/all';
      this.$debug(url);
      this.$http
        .get(url, {
          headers: {
            Authorization: btoa(
              this.settings.notify_userName.value +
              ':' +
              this.settings.notify_password.value
            )
          }
        })
        .then(r => {
          this.$debug(r);
          try {
            let content = JSON.parse(r.bodyText);
            if (content.length && content[0].actionId) {
              return true;
            } else {
              return false;
            }
          } catch (err) {
            return false;
          }
        })
        .catch(r => {
          this.$error(r);
          return false;
        }).then(r => {
          if (r) {
            this.$notify.success('Успешно выполнен тестовый запрос');
          } else {
            this.$notify.error('Не выполнен тестовый запрос');
          }
          this.testIsLoading = false;
        });
    },
    loadSettings() {
      this.isLoading = true;
      this.$store
        .dispatch('findSettings', [
          'notify_hostname',
          'notify_userName',
          'notify_password'
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
    this.loadSettings();
  }
};
</script>
