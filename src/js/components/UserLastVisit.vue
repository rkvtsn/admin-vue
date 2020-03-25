<template>
  <div v-if="visitTime"
       class="UserLastVisit">
    <div class="UserLastVisit__Item">
      <span class="UserLastVisit__ItemUsername">{{username}}</span>

      <span v-if="isActive"
            class="UserLastVisit__ItemUsername">({{user.fullName}}) в системе {{visitTime}}</span>

      <a class="UserLastVisit__ItemLink"
         @click="isActive = !isActive">{{ (!isActive) ? 'подробнее' : 'свернуть' }}</a>
    </div>

  </div>
</template>

<style lang="scss">
.UserLastVisit {
  display: flex;
  margin-left: 10px;
  .UserLastVisit__Item {
    margin-left: 5px;
    font-size: 13px;
    color: #999;
    font-weight: normal;
    &Link {
      cursor: pointer;
    }
  }
}
</style>

<script>
export default {
  name: 'user-last-visit',

  props: {

    user: {
      type: Object,
      default: () => {
        return {
          lastAuth: null,
          fullName: null,
          userName: null,
        };
      }
    }

  },

  data() {
    return {
      username: null,
      visitTime: null,
      timer: null,
      isActive: false,
    };
  },

  watch: {
    user(v) {
      this.tick();
    },
    visitTime(v) {
      if (!v) {
        this.isActive = false;
      }
    }
  },

  methods: {

    getVisitTime() {
      if (this.user && this.user.lastAuth) {
        let time = this.user.lastAuth;
        var delta = Math.abs(new Date() - time) / 1000;
        var days = Math.floor(delta / 86400);
        delta -= days * 86400;
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;
        this.username = this.user.userName;
        let result = '';
        if (days == 0 && hours == 0 && minutes == 0) {
          return 'менее минуты';
        } else {
          if (days) {
            result += `${days} дн. `;
          }
          if (hours) {
            result += `${hours} час. `;
          }
          if (minutes) {
            result += `${minutes} мин. `;
          }
        }
        return result;
      }
      this.username = null;
      return null;
    },

    tick() {
      this.visitTime = this.getVisitTime();
      if (this.visitTime == null) return;
      this.timer = setTimeout(this.tick, 30000);
    }

  },


};
</script>
