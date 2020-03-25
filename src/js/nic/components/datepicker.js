/**
 * Usage:
 *
 *
 * <nic-datepicker></nic-datepicker>
 *
 * <nic-datepicker format='DD.MM.YYYY' v-model='22.03.2019' readonly width='238px'>
 * </nic-datepicker>
 *
 * <nic-datepicker @input="onInputDate"></nic-datepicker>
 *
 * @author: vvolovikov
 */
var u = window.u;

var NicDatepicker = {
    props: {
        width: {
            type: String,
            default: '204px'
        },
        readonly: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: ''
        },
        format: {
            type: String,
            default: 'DD.MM.YYYY'
        }
    },
    data: function() {
        return {
            styleObj: {},
            show: false,
            days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            date: [],
            now: new Date()
        };
    },
    watch: {
      now: function() {
          this.update();
      },
      show: function() {
          this.update();
      }
    },
    methods: {
      setValue: function(v) {
        this.$emit('input', v);
      },
      close: function() {
          document.removeEventListener('click', this.leave, false);
          this.show = false;
      },
      update: function() {
          var that = this;

          var getPassDayList = function() {
              var time = new Date(that.now),
                  arr = [];

              time.setMonth(time.getMonth(), 1);
              var startDayCurrentMonth = time.getDay();

              time.setMonth(time.getMonth(), 0);
              var totalDayPrevisionMonth = time.getDate();

              time.setDate(0);

              if (startDayCurrentMonth === 0) {
                  startDayCurrentMonth = 7;
              }
              for (var i = startDayCurrentMonth - 1; i > 0; i--) {
                  arr.push({
                      text: totalDayPrevisionMonth - i + 1,
                      time: new Date(time.getFullYear(), time.getMonth(), totalDayPrevisionMonth - i + 1),
                      status: 'date-pass'
                  });
              }
              return arr;
          };
          var getCurrentDayList = function() {
              var time = new Date(that.now),
                  arr = [];

              time.setMonth(time.getMonth() + 1, 0);
              var totalDayCurrentMonth = time.getDate();
              time.setDate(1);

              var currentDate = that.value || that.stringify(new Date());

              for (var i = 0; i < totalDayCurrentMonth; i++) {
                  var tmpTime = new Date(time.getFullYear(), time.getMonth(), i + 1),
                      status = '';

                  if (that.stringify(tmpTime) === currentDate) {
                      status = 'date-active';
                  }
                  arr.push({
                      text: i + 1,
                      time: tmpTime,
                      status: status
                  });
              }
              return arr;
          };
          var getNextDayList = function(length) {
              var time = new Date(that.now),
                  j = 1,
                  arr = [];

              for (var i = length; i < 42; i++) {
                  arr.push({
                      text: j,
                      time: new Date(time.getFullYear(), time.getMonth() + 1, j),
                      status: 'date-future'
                  });
                  j++;
              }
              return arr;
          };
          var result = [].concat(getPassDayList(), getCurrentDayList());
          this.date = result.concat(getNextDayList(result.length));

      },
      yearClick: function(flag) {
          this.now.setFullYear(this.now.getFullYear() + flag);
          this.now = new Date(this.now);
      },
      monthClick: function(flag) {
          this.now.setMonth(this.now.getMonth() + flag);
          this.now = new Date(this.now);
      },
      pickDate: function(index) {
          this.setValue(this.stringify(new Date(this.date[index].time)));
          this.close();
      },
      parse: function(str) {
          var time = new Date(str);
          return isNaN(time.getTime()) ? null : time;
      },
      stringify: function(time = this.now, format = this.format) {
          var year = time.getFullYear();
          var month = time.getMonth() + 1;
          var date = time.getDate();
          var monthName = this.months[time.getMonth()];

          var map = {
              YYYY: year,
              MMM: monthName,
              MM: ('0' + month).slice(-2),
              M: month,
              DD: ('0' + date).slice(-2),
              D: date
          };
          return format.replace(/Y+|M+|D+/g, function(str) {
              return map[str];
          });
      },
      leave: function(e) {
          if (!this.$el.contains(e.target)) {
              this.close();
          }
      },
      showCalendar: function() {
          if (!this.show) {
              this.show = true;
              document.addEventListener('click', this.leave, false);
          }
      }
    },
    ready: function() {
      this.now = this.parse(this.value) || new Date();
      document.addEventListener('click', this.leave, false);
    },
    beforeDestroy: function() {
      document.removeEventListener('click', this.leave, false);
    },
    template: '<div class="datetime-picker" :style="{ width: width }">' +
          '<input ' +
              'type="text" ' +
              ':style="styleObj" ' +
              ':readonly="readonly" ' +
              ':value="value" ' +
              '@keyup.enter="close"' +
              '@input="$emit(\'input\', $event.target.value)"' +
              '@click="showCalendar">' +
          '<div class="picker-wrap" v-show="show" :style="{ width: width }">' +
              '<table class="date-picker">' +
                  '<thead>' +
                      '<tr class="date-head">' +
                          '<th colspan="4">' +
                              '<span class="sprite sprite-medium sprite-pointer-left btn-prev" @click="monthClick(-1)"></span>' +
                              '<span class="show-month">{{months[now.getMonth()]}}</span>' +
                              '<span class="sprite sprite-medium sprite-pointer-right btn-next" @click="monthClick(1)"></span>' +
                          '</th>' +
                          '<th colspan="3">' +
                              '<span class="sprite sprite-medium sprite-pointer-left btn-prev" @click="yearClick(-1)"></span>' +
                              '<span class="show-year">{{now.getFullYear()}}</span>' +
                              '<span class="sprite sprite-medium sprite-pointer-right btn-next" @click="yearClick(1)"></span>' +
                          '</th>' +
                      '</tr>' +
                      '<tr class="date-days">' +
                          '<th v-for="day in days">{{day}}</th>' +
                      '</tr>' +
                  '</thead>' +
                  '<tbody>' +
                      '<tr v-for="(el, i) in 6">' +
                          '<td v-for="(el, j) in 7"' +
                              ':class="date[i * 7 + j] && date[i * 7 + j].status"' +
                              ':date="date[i * 7 + j] && date[i * 7 + j].date"' +
                              '@click="pickDate(i * 7 + j)">{{date[i * 7 + j] && date[i * 7 + j].text}}</td>' +
                      '</tr>' +
                  '</tbody>' +
              '</table>' +
          '</div>' +
      '</div>'
};
var NicDatepickerPlugin = {
  install: function install(Vue) {
    Vue.component('nic-datepicker', NicDatepicker);
  }
};
if (typeof module !== 'undefined') {
  module.exports = NicDatepickerPlugin;
} else if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(NicDatepickerPlugin);
}
