<template>
  <modal :value="value"
         class="modal-about"
         @input="$emit('input', $event)"
         height="500px"
         max-width="600px"
         title="Информация о программе">

    <h4>{{pkName}} ({{projectName}})</h4>
    <ul>

      <li>
        <div class="about-info-left">Версия:</div>
        <div class="about-info-right">{{versionInfo}}</div>
      </li>
      <li>
        <div class="about-info-left">Каталог установки:</div>
        <div class="about-info-right">{{model.installPath}}</div>
      </li>
      <li>
        <div class="about-info-left">Дата установки:</div>
        <div class="about-info-right">{{model.installDate}}</div>
      </li>
      <li>
        <div class="about-info-left">Наименование службы:</div>
        <div class="about-info-right">{{model.serviceName}}</div>
      </li>
      <li>
        <div class="about-info-left">Программные комплексы:</div>
        <div class="about-info-right">{{model.pkNames}}</div>
      </li>
    </ul>
    <textarea v-model="model.changelog"
              readonly></textarea>
    <button class="btn-close btn btn-primary"
            @click.prevent="$emit('input', false)">Закрыть</button>

  </modal>
</template>


<style lang="scss">
.modal-about {
  padding: 5px;
  .btn-close {
    display: flex;
    margin: auto;
    margin-right: 0;
  }
  textarea {
    height: 170px;
    width: 100%;
    overflow-y: scroll;
  }
  ul {
    list-style-type: none;
    li {
      display: flex;
      margin-bottom: 5px;
    }
  }
  .about-info-left {
    max-width: 130px;
    min-width: 130px;
    font-weight: bold;
    text-align: right;
    display: inline-block;
    margin-right: 10px;
  }
}
</style>

<script>
import { models } from '../models';

export default {

  components: {
    'modal': () => import('@/js/components/Modal.vue')
  },

  name: 'about-pk',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    projectName: {
      type: String,
      default: ''
    },
    pkName: {
      type: String,
      default: ''
    },
    version: {
      type: String,
      default: ''
    },
    releaseDate: {
      type: String,
      default: ''
    },
    releaseVersion: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      model: new models.admin.SystemInformation(),
      versionInfo: ''
    };
  },

  watch: {
    async value(v) {
      if (v) {
        this.model.getBy('about');
        this.versionInfo = `${this.version}${this.releaseVersion != '' ? '-' : ''}${this.releaseVersion} ${(this.releaseDate && this.releaseDate != 'undefined') ? `от ${this.releaseDate}` : ''}`;
      }
    }
  }

};
</script>
