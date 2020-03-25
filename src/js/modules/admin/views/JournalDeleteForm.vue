<template>
  <div class="Journal-Delete">

    <nic-window title="Удаление записей"
                type="dialog"
                icon="question"
                @close="modal = false"
                :active="modal">
      <div>Вы уверены, что хотите удалить записи журнала событий с {{new Date(deleteDates.from).format('d.m.Y H:i')}} по {{new Date(deleteDates.until).format('d.m.Y H:i')}}?</div>
      <div slot="footer">
        <button class="btn btn-nic"
                @click="del">Да</button>
        <button class="btn btn-nic"
                @click="modal = false">Нет</button>
      </div>
    </nic-window>

    <h2>Удаление данных из журнала в интервале дат:</h2>
    <nic-form @submit="submit"
              :autoheight="false"
              :bottom-toolbar="false"
              :validation="deleteDates.$validator">

      <nic-datepicker :validation="deleteDates.$validator.from"
                      :minute-step="1"
                      label="С"
                      confirm
                      value-type="timestamp"
                      format="DD.MM.YYYY HH:mm"
                      type="datetime"
                      v-model="deleteDates.from"></nic-datepicker>

      <nic-datepicker :validation="deleteDates.$validator.until"
                      :minute-step="1"
                      label="По"
                      confirm
                      value-type="timestamp"
                      format="DD.MM.YYYY HH:mm"
                      type="datetime"
                      v-model="deleteDates.until"></nic-datepicker>
      <template #footer>
        <div class="NicForm__BottomToolbar">
          <button class="btn btn-primary"
                  @clcik="submit">Удалить</button>
          <button class="btn btn-default"
                  @click.prevent="goBack">Отменить</button>
        </div>
      </template>
    </nic-form>
  </div>
</template>

<script>
import { required } from '@/js/addons/validation';
import { Model } from '@/js/models';

class DeleteDates extends Model {

  get $defaultValue() {
    return {
      from: new Date(),
      until: new Date()
    };
  }

  get $vRules() {
    return {
      from: [required()],
      until: [required()]
    };
  }
}

export default {
  data() {
    return {
      modal: false,
      deleteDates: new DeleteDates()
    };
  },
  activated() {
    this.deleteDates.until = new Date();
    this.deleteDates.from = new Date();
  },
  methods: {
    numToStr(num) {
      return num <= 10 ? `0${num}` : num;
    },
    goBack() {
      this.$router.push({ name: 'Journal.vue' });
    },
    submit(e) {
      this.modal = true;
    },
    del() {
      this.$store
        .dispatch('deleteBetweenDates', this.deleteDates)
        .then(e => {
          this.modal = false;
          this.$notify.success('Удалены данные из журнала');
          return true;
        })
        .catch(e => {
          this.modal = false;
          return false;
        }).finally(() => {
          this.$nextTick(() => {
            this.goBack();
          });
        });
    }
  }
};
</script>

