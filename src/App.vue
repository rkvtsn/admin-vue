<style lang="scss">
.error-line {
  margin: 0;
  padding: 0;
  padding-top: 7px;
  &:first-child {
    padding: 0;
  }
  &::after {
    content: "";
  }
}

.error-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.navbar-header {
  display: flex;
  vertical-align: middle;
  align-items: center;
}
</style>

<template>
  <div class="mo-app"
       :class="{'no-header': !isHeader}">
    <nic-app v-cloak>
      <about-pk pk-name="000"
                v-model="isShowed"
                :project-name="projectName"
                :version="version"
                :release-date="releaseDate"
                :release-version="releaseVersion"></about-pk>

      <div class="nic-app-header navbar navbar-fixed-top"
           v-if="isHeader">
        <div class="container-fluid">
          <div class="navbar-header">
            <router-link class="navbar-brand project-name"
                         to="/"><img src="@/img/glonass.png" />{{ projectName }}</router-link>
            <user-last-visit :user="$store.getters.currentUser" />
          </div>
          <ul class="navbar-right nav navbar-nav"
              v-if="isAuthorized">
            <nic-navbar-dropdown :text="$store.getters.currentUser.fullName"
                                 icon="sprite-user">
              <template slot="items">
                <nic-navbar-element>
                  <nic-navbar-item @click="showAbout"
                                   :model="{text: 'О программе'}"></nic-navbar-item>
                  <nic-navbar-item @click="showHelp"
                                   :model="{text: 'Справка'}">
                  </nic-navbar-item>
                  <nic-navbar-item @click="logout"
                                   :model="{text: 'Выйти'}"></nic-navbar-item>
                </nic-navbar-element>
              </template>
            </nic-navbar-dropdown>
          </ul>
        </div>
      </div>

      <router-view :project-name="projectName"
                   @hide-header="isHeader = false">
        <div slot="sidebar"></div>
      </router-view>
      <div class="navbar navbar-fixed-bottom footer"
           style="width: 200px"
           v-if="isAuthorized">
        <div class="footer__content">© 0</div>
      </div>
    </nic-app>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';

export default {

  name: 'App',

  components: {
    'about-pk': () => import('@/js/components/AboutPk.vue'),
    'modal': () => import('@/js/components/Modal.vue'),
    'user-last-visit': () => import('@/js/components/UserLastVisit.vue'),
  },

  data() {
    return {
      isShowed: false,
      isHeader: true,
    };
  },

  props: {
    releaseVersion: {
      type: String,
      default: ''
    },
    releaseDate: {
      type: String,
      default: ''
    },
    version: {
      type: String,
      default: ''
    },
    projectName: {
      type: String,
      default: ''
    }
  },

  watch: {
    '$route.path'() {
      let title = this.projectName;
      if (this.$route.meta && this.$route.meta.title) {
        title = this.$route.meta.title + ' | ' + title;
      }
      document.title = title;
    }
  },

  computed: {
    ...mapGetters(['isAuthorized', 'checkPermissions'])
  },

  methods: {

    showAbout() {
      this.isShowed = true;
    },

    showHelp() {
      let helpKey = 'MAIN';
      if (this.$route.meta && this.$route.meta.helpKey)
        helpKey = this.$route.meta.helpKey;
      let routeData = this.$router.resolve({ name: 'HelpNicedit.vue', params: { helpKey: helpKey } });
      //window.open(routeData.href , '_blank');
      try {
        var wnd = window.open(routeData.href, 'HELP', 'width=1000,height=500,toolbar=no,menubar=no,status=no,resizable=yes,help=no');
        wnd.focus();
      } catch (myException) {
        alert('Ошибка открытия окна. Проверьте настройки блокировки всплывающих окон в браузере!');
      }
    },

    logout() {
      this.$store
        .dispatch('logout')
        .then(() => {
          this.$router.push({ name: 'LoginForm.vue' });
          document.title = this.projectName;
        });
    },
  },

};
</script>
