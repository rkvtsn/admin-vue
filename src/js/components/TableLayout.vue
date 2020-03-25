<template>
  <div>

    <nic-window title="Удаление записи"
                type="dialog"
                icon="question"
                :active="modal"
                @close="modal = false">
      <div>Вы уверены, что хотите удалить запись?</div>
      <div slot="footer">
        <button class="btn btn-nic"
                @click.stop.prevent="deleteItem">Да</button>
        <button class="btn btn-nic"
                @click.stop.prevent="modal = false">Нет</button>
      </div>
    </nic-window>

    <slot name="after-toolbar"></slot>
    <nic-loader :is-loading="loading">
      <nic-toolbar v-if="toolbar">

        <nic-toolbar-item icon="sprite-refresh"
                          title="Обновить"
                          @click.stop.prevent="list"></nic-toolbar-item>

        <slot v-bind="instance"
              name="toolbar"></slot>

        <template v-if="editable">
          <nic-toolbar-item title="Добавить"
                            icon="sprite-plus"
                            v-if="isAdd"
                            :disabled="toolbarDisabled"
                            @click.stop.prevent="create"></nic-toolbar-item>
          <nic-toolbar-item title="Редактировать"
                            icon="sprite-pencil"
                            v-if="isEdit"
                            :disabled="selectedItem === null || selectedItem.isReadonly || selectedItem.readonly"
                            @click.stop.prevent="edit"></nic-toolbar-item>
          <nic-toolbar-item v-if="selectedItem !== null && (selectedItem.isReadonly || selectedItem.readonly)"
                            title="Просмотреть"
                            icon="sprite-search"
                            :disabled="selectedItem === null"
                            @click.stop.prevent="$router.push({name: typeCapitalized + 'View.vue', params: {id: selectedId || 0}})"></nic-toolbar-item>

          <nic-toolbar-item v-if="isDelete"
                            type="separator"></nic-toolbar-item>
          <nic-toolbar-item title="Удалить"
                            icon="sprite-cross"
                            v-if="isDelete"
                            :disabled="selectedItem === null || selectedItem.isDeleted || selectedItem.isReadonly  || selectedItem.readonly"
                            @click.stop.prevent="modal = true"></nic-toolbar-item>
          <slot name="toolbar-editable"
                v-bind="instance"></slot>
        </template>

        <template v-else>
          <nic-toolbar-item v-if="viewable"
                            title="Просмотреть"
                            icon="sprite-search"
                            :disabled="selectedItem === null"
                            @click.stop.prevent="$router.push({name: typeCapitalized + 'View.vue', params: {id: selectedId || 0}})"></nic-toolbar-item>
          <slot v-bind="instance"
                name="toolbar-not-editable"></slot>
        </template>

      </nic-toolbar>
      <div v-show="tableData.length > 0">
        <nic-table v-if="custom"
                   type="table-bordered"
                   :class="{'table-striped': tableStriped}"
                   :equals="equals"
                   :value="selectedItem"
                   :rowRender="rowRender"
                   :selectable="selectable"
                   :data="tableData"
                   :columns="tableColumns"
                   @row-click="click"
                   @sort="listItems"
                   @input="selectItem">
          <template slot-scope="item">
            <slot name="table-template"
                  v-bind="item"></slot>
          </template>
        </nic-table>
        <nic-table v-else
                   :equals="equals"
                   :value="selectedItem"
                   type="table-bordered"
                   :class="{'table-striped': tableStriped}"
                   :rowRender="rowRender"
                   :selectable="selectable"
                   :data="tableData"
                   :columns="tableColumns"
                   @row-click="click"
                   @sort="listItems"
                   @input="selectItem">
        </nic-table>
        <nic-paginator v-if="pageable"
                       v-model="currentPage"
                       :total-page="totalPages"
                       @goto="gotoPage" />
        <!-- :count-elements="10"
                       :total-elements="22" -->
        <slot name="paginator"></slot>
      </div>
      <h4 v-show="tableData.length === 0 && !loading">
        <slot name="text-empty">Данные отсутсвуют</slot>
      </h4>
    </nic-loader>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'table-layout',
  props: {
    tableStriped: {
      type: Boolean,
      default: false,
    },
    isDelete: {
      type: Boolean,
      default: true
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    viewable: {
      type: Boolean,
      default: true
    },
    value: {
      type: [Array, Object],
      default: () => {
        return null;
      }
    },
    api: {
      type: Object,
      default: () => null
    },
    rowRender: {
      type: Function,
      default: function (options, item) { }
    },
    selectable: {
      type: Boolean,
      default: true
    },
    filterBy: {
      type: Function,
      default: ({ params }) => {
        return { params };
      }
    },
    pageable: {
      type: Boolean,
      default: true
    },
    pageSize: {
      type: Number,
      default: 10
    },
    custom: {
      type: Boolean,
      default: false
    },
    tableColumns: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ""
    },
    authGroup: {
      type: Array,
      default: () => []
    },
    toolbar: {
      type: Boolean,
      default: true
    },
    toolbarDisabled: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => null
    },
    id: {
      type: String,
      default: 'id'
    }
  },
  data: function () {
    let selectedItem = this.value || null;
    let loading = this.isLoading;
    return {
      items: [],
      selectedItem,
      authorization: null,
      totalPages: 1,
      currentPage: 1,
      modal: false,
      sortKey: null,
      sortOrder: "desc",
      loading,
    };
  },
  computed: {
    instance() {
      return this;
    },
    tableData() {
      return this.data || this.items;
    },
    selectedId() {
      if (this.selectedItem) {
        return this.selectedItem[this.id];
      } else {
        return null;
      }
    },
    ...mapState(['currentUser']),
    ...mapGetters(['checkPermissions']),
    editable() {
      if (!this.toolbar) return false;
      var group = [this.type.toUpperCase() + '_EDIT'];
      if (this.authGroup && this.authGroup.length > 0) {
        group = this.authGroup;
      }
      return this.checkPermissions(group);
    },
    typeCapitalized() {
      if (!this.toolbar) return '';
      return this.type.charAt(0).toUpperCase() + this.type.slice(1);
    }
  },
  watch: {
    currentUser(value) {
      this.authorization = value;
    },
    isLoading(value) {
      this.loading = value;
    },
    value(value) {
      this.selectedItem = value;
    },
    currentPage(value) {
      this.listItems();
    }
  },
  methods: {
    click(r) {
      this.$emit('row-click', r);
    },
    equals(v1, v2) {
      if (v1 !== v2) {
        if (
          v1 !== null &&
          v2 !== null &&
          v1 !== undefined &&
          v2 !== undefined &&
          typeof v1 === 'object' &&
          typeof v2 === 'object'
        ) {
          return v1[this.id] === v2[this.id];
        }
      }
      return false;
    },
    selectItem(x) {
      this.selectedItem = x;
      this.$emit("input", this.selectedItem);
    },
    edit() {
      if (this.$listeners && this.$listeners['on-edit']) {
        this.$emit("on-edit", this.selectedId);
      } else {
        this.$router.push({
          name: this.typeCapitalized + 'Edit.vue',
          params: { id: this.selectedId || 0 }
        });
      }
    },
    create() {
      if (this.$listeners && this.$listeners['on-create']) {
        this.$emit('on-create');
      } else {
        this.$router.push({ name: this.typeCapitalized + 'Create.vue' });
      }
    },
    listItems(sortKey, sortOrder) {
      this.loading = true;
      let currentPage = this.currentPage < 0 ? 0 : this.currentPage - 1;
      let params = { sort: [] };
      if (sortKey) {
        this.sortOrder = sortOrder === -1 ? 'desc' : 'asc';
        this.sortKey = sortKey;
      }
      if (this.sortKey) {
        let properties = String(this.sortKey).split(',');
        if (Array.isArray(properties)) {
          params.sort = params.sort.concat(properties.map(x => ({ property: x, direction: this.sortOrder })));
        } else {
          params.sort.push(
            {
              property: this.sortKey,
              direction: this.sortOrder
            }
          );
        }
      }

      if (this.pageable) {
        params.page = currentPage;
        params.size = this.pageSize;
      }
      if (this.data) {
        this.filterBy({ params });
        params.do = d => {
          if (!params.sort || params.sort.length == 0 || !params.sort[0].direction) return d;
          return d.sort((x, y) => {
            let expr =
              this.$util.getBy(this.tableColumns, 'key', params.sort[0].property).sort ||
              this.$util.getBy(this.tableColumns, 'key', params.sort[0].property).expr;
            if (expr) {
              x = expr(x);
              y = expr(y);
            }
            if (x > y) {
              return 1 * sortOrder;
            } else if (x < y) {
              return -1 * sortOrder;
            } else {
              return 0;
            }
          });
        };
        this.$emit('refresh', params);
        this.loading = false;
        return;
      }

      let lis =
        this.api !== null
          ? this.api.list(this.filterBy({ params }))
          : this.$store.dispatch(
            this.type + '/list',
            this.filterBy({ params })
          );
      this.$emit(
        'on-list',
        lis.then(r => {
          let data = r.data ? r.data : r;
          this.totalPages = data.totalPages;
          this.items = data.content;
          this.loading = false;
          return this.items;
        })
      );
    },
    deleteItem() {
      let del =
        this.api !== null
          ? this.api.delete(this.selectedId)
          : this.$store.dispatch(this.type + '/delete', this.selectedId);

      return del
        .then(r => {
          this.modal = false;
          this.$emit('deleted', true);
          this.list();
          return r;
        })
        .catch(e => {
          this.modal = false;
          this.$emit('deleted', false);
          this.$error(e);
          this.list();
        });
    },
    gotoPage(page) {
      this.currentPage = page;
    },
    list() {
      this.currentPage = 1;
      this.listItems();
    }
  },
  created() {
    this.authorization = this.$store.state.currentUser;
  },
  activated() {
    this.listItems();
  }
};
</script>
