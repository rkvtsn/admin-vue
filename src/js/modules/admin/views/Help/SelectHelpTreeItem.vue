<template>
  <div class="help_index full-height">

    <nic-loader :is-loading="treeisLoading">
      <nic-tree class="fcp_tree"
                style=" z-index: 1; height: 100%; position: relative;"
                ref="treeHelp"
                @deselect="p => selectedItem.itemKey = null"
                @select="(p) => onSelectTreeItem(p.model)"
                :model="treeData"
                :titleKey="(x) => `${x.number ? x.number + '. ' : ''}${x.itemName}`">
      </nic-tree>
    </nic-loader>

    <div align="right">
      <button class="btn btn-default btn-widget"
              @click.prevent="onSubmit">Выбрать</button>
      <button class="btn btn-default btn-widget"
              @click.prevent="cancel()">Отмена</button>
    </div>

  </div>

</template>

<script>

import { models } from '@/js/models';
import { mapGetters } from 'vuex';
import HelpApi from '@/js/modules/admin/api/HelpItemApi.js';
import HelpItem from "../../models/HelpItem";

export default {
  data() {
    return {
      treeisLoading: true,
      helpApi: new HelpApi(),
      treeData: {
        isRoot: true,
        name: "",
        itemKey: "",
        children: [],
        selected: false,
        open: false
      },
      selectedItem: new HelpItem(),
      selectedItemParams: {},
      modal: false,
      lastSelectedId: null,
    };
  },
  methods: {
    getFullChildrenList(item) {
      let result = [];
      for (let child of item.children) {
        result = result.concat(this.getFullChildrenList(child));
      }
      return result;
    },
    async onSelectTreeItem(item) {
      this.selectedItem.itemKey = item.itemKey;
      this.selectedItem.itemName = item.itemName;
    },
    selectTreeItem(children, id) {
      for (let child of children) {
        if (child.model.id !== id) {
          this.selectTreeItem(child.$children, id);
        } else {
          child.select();
          child.expand();
          return;
        }
      }
    },

    async fetchData(params) {
      this.treeisLoading = true;

      let tree = await this.helpApi.getRootsTree();
      let root = tree.pop(0);
      root.isRoot = true;

      Object.assign(this.treeData, root);

      this.treeisLoading = false;

      this.$nextTick(() => {
        this.selectTreeItem(this.$refs.treeHelp.$children,
          root.id);
        this.$refs.treeHelp.toggle(true);
      });

    },
    clearSelection(c) {
      this.$refs.treeHelp.deselect();
    },

    onSubmit() {
      this.$emit('select-help-tree-elem', this.selectedItem);
      this.$emit('submit');
    },
  },
  computed: {

    ...mapGetters(['checkPermissions']),

  },
  mounted() {
    this.fetchData();
  },



};
</script>
