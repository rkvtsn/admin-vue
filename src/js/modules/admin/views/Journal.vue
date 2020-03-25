<template>
  <div class="Journal">
    <nic-loader :is-loading="journalApi.isLoading">
      <div class="filter journal-filter">

        <panel-filter @apply="list()"
                      @cancel="() => { clearFilter(); list(); }">

          <nic-datepicker :minute-step="1"
                          label="С"
                          confirm
                          width="100%"
                          value-type="timestamp"
                          format="DD.MM.YYYY HH:mm"
                          type="datetime"
                          v-model="filter.datedFrom.value"></nic-datepicker>
          <nic-datepicker :minute-step="1"
                          label="По"
                          confirm
                          width="100%"
                          value-type="timestamp"
                          format="DD.MM.YYYY HH:mm"
                          type="datetime"
                          v-model="filter.datedTo.value"></nic-datepicker>

          <nic-input label="Имя пользователя"
                     v-model="filter.login.value" />
          <nic-input label="IP-адрес"
                     v-model="filter.ip.value" />
          <nic-select label="Уровень"
                      :data="levels"
                      v-model="filter.level.value" />

          <nic-select label="Тип события"
                      width="250px"
                      :data="actions"
                      v-model="filter.action.value" />

          <nic-input label="Комментарий"
                     v-model="filter.message.value" />

        </panel-filter>

      </div>

      <table>
        <tr>
          <td>
            <nic-toolbar class="toolbar__element element__control">
              <nic-toolbar-item icon="sprite-refresh"
                                title="Обновить"
                                @click="list"></nic-toolbar-item>
              <nic-toolbar-item :disabled="!checkPermissions(['LOG_EDIT'])"
                                icon="sprite-cross"
                                title="Очистить"
                                @click="showDeleteDialog"></nic-toolbar-item>
            </nic-toolbar>
          </td>
          <td>
            <div class="element__search">
              <div class="input-group">
                <input v-model="searchText"
                       @keyup.enter="list"
                       type="text"
                       class="search-text form-control"
                       placeholder="Поиск">
                <button class="btn btn-icon"
                        @click="list"
                        type="submit">
                  <span class="sprite sprite-medium sprite-search"></span>
                </button>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <div v-show="totalPages > 0">
        <nic-table :value="null"
                   type="table-bordered"
                   @sort="listItems"
                   :data="journalList"
                   :columns="tableColumns">
        </nic-table>
        <nic-paginator :total-page="totalPages"
                       v-model="currentPage"
                       @goto="gotoPage" />
      </div>
      <h3 v-show="totalPages === 0">Ничего не найдено</h3>
    </nic-loader>
  </div>
</template>

<script>
import { API, POST } from '@/js/addons/api';
import { mapGetters } from 'vuex';

export default {

  components: {
    'panel-filter': () => import('@/js/components/form/PanelFilter.vue'),
  },


  data() {

    return {
      searchText: null,
      totalPages: 1,
      currentPage: 1,
      authorization: null,
      sortKey: null,
      sortOrder: -1,
      journalApi: API('journal'),
      journalList: [],
      levels: [
        'Отладка',
        'Информация',
        'Предупреждение',
        'Ошибка'
      ],
      actions: [],

      filter: {
        message: {
          value: '',
          operation: 'LIKE'
        },
        ip: {
          value: ''
        },
        action: {
          value: ''
        },
        level: {
          value: ''
        },
        login: {
          value: '',
          operation: 'LIKE'
        },
        datedFrom: {
          value: null,
          default: null,
          field: 'dated',
          operation: 'GE'
        },
        datedTo: {
          value: null,
          default: null,
          field: 'dated',
          operation: 'LE'
        }
      },

      tableColumns: [
        { key: 'dated', text: 'Время события', format: 'd.m.Y H:i:s' },
        { key: 'login', text: 'Имя пользователя' },
        { key: 'ip', text: 'IP-адрес' },
        { key: 'level', text: 'Уровень' },
        { key: 'action', text: 'Тип события' },
        { key: 'message', text: 'Комментарий' },
      ]

    };
  },

  async created() {
    this.actions = (await POST('journal/actions')).data;
    this.listItems();
  },


  watch: {
    currentPage() {
      this.listItems();
    }
  },


  methods: {

    clearFilter() {
      for (let fKey of Object.keys(this.filter)) {
        this.filter[fKey].value = this.filter[fKey].default || '';
      }
    },

    listItems(sortKey, sortOrder) {
      let currentPage = this.currentPage < 0 ? 0 : this.currentPage - 1;
      let params = { page: currentPage, size: 10 };
      let filter = Object.assign({}, this.filter);
      if (this.searchText && this.searchText !== '') {
        params.filter = 'search:' + this.searchText;
        this.clearFilter();
      }
      if (sortKey) {
        sortOrder = (sortOrder === -1) ? 'desc' : 'asc';
        this.sortKey = sortKey;
        this.sortOrder = sortOrder;
      }
      if (this.sortKey) {
        params.sort = [{
          property: this.sortKey,
          direction: this.sortOrder
        }];
      }
      this.journalApi.list({ params }, filter).then(x => {
        this.journalList = x.content;
        this.totalPages = x.params.totalPages;
      });
    },

    gotoPage(page) {
      this.currentPage = page;
    },

    list() {
      this.currentPage = 1;
      this.listItems();
    },

    showDeleteDialog() {
      this.$router.push({ name: 'JournalDeleteForm.vue' });
    },

  },
  computed: {
    ...mapGetters(['checkPermissions'])
  },

};
</script>
