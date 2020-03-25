<template>
  <div class="help_index full-height">

    <table class="table">
      <tr>
        <td valign="top">
          <div style="width: 450px; margin-right: 10px;">
            <nic-toolbar class="program__toolbar program_toolbar-tree">
              <nic-toolbar-item :disabled="selectedItem.itemKey === null"
                                icon="sprite-upload"
                                title="Экспорт"
                                @click.stop.prevent="exportToZip(selectedItem.itemKey)"></nic-toolbar-item>
              <div class="nic-file-uploader__btn nic-toolbar-item"
                   title="Импорт">
                <button @click.stop.prevent="onInputUpload"
                        :disabled="selectedItem.itemKey === null"
                        class="btn btn-default">
                  <span class="sprite sprite-large sprite-download"></span>
                </button>
                <input ref="input-upload"
                       width="1px"
                       height="1px"
                       style="width: 1px !important; height: 1px !important; border: 0px !important; margin-top: -15px; margin-left: 15px;"
                       type="file"
                       class="nic-file-uploader__input"
                       @change="onChangeFile">
              </div>
            </nic-toolbar>
            <nic-loader :is-loading="treeisLoading">
              <nic-tree style=" z-index: 1; height: 100%; position: relative;"
                        ref="treeHelp"
                        @deselect="p => selectedItem.itemKey = null"
                        @select="(p) => onSelectTreeItem(p.model)"
                        :model="treeData"
                        :title-key="(x) => `${x.itemName}`"
                        children-key="childrenWithoutLabels">
              </nic-tree>
            </nic-loader>
          </div>
        </td>
        <td valign="top"
            style="width: 100%;">
          <div>
            <keep-alive>
              <nicedit :help-item="helpItem"
                       :editable="editable"
                       @on-save-help-item="onSaveHelpItem"
                       @on-delete-help-item="onDeleteHelpItem">
              </nicedit>
            </keep-alive>

          </div>
        </td>
      </tr>
    </table>

  </div>
</template>

<style lang="less" scoped>
</style>

<script>
import { downloadFile } from "@/js/addons/requests";
import { mapGetters } from 'vuex';
import HelpApi from '@/js/modules/admin/api/HelpItemApi.js';
import HelpItem from "../../models/HelpItem";

export default {
  components: {
    nicedit: () => import("./Nicedit")
  },
  data() {
    return {
      disabled: true,
      nicedit: 'nicedit',
      treeisLoading: true,
      helpApi: new HelpApi(),
      treeData: {
        isRoot: true,
        name: '',
        itemKey: '',
        htmlContent: '',
        childrenWithoutLabels: [],
        selected: false,
        open: true
      },
      selectedItem: new HelpItem(),
      selectedItemParams: {},
      modal: false,
      lastSelectedId: null,
      isImportZip: false
    };
  },


  mounted() {
    this.fetchData();
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
      let htmlContent = await this.helpApi.getContent(item.itemKey);
      this.selectedItem.htmlContent = htmlContent;
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
    exportToZip(itemKey) {
      downloadFile('helps/export/zip', "helpItems.zip", { options: { params: { helpItemKey: itemKey } } });
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

    onChangeFile(e) {
      if (this.isImportZip) return;

      this.isImportZip = true;

      let fd = new FormData();
      fd.append('file', e.target.files[0]);

      this.$refs['input-upload'].value = '';
      this.helpApi.importZip(fd).then(x => {
        this.isImportZip = false;
        let result = x.data ? x.data : x;
        if (result.strError) {
          this.$notify.error(
            `<div class="notify-text">Возникли ошибки при импорте справки!</br>` + strError + `</div>`,
            { mode: 'html', visibility: 7000, duration: 300000 }
          );
        } else {
          this.$notify.success('Данные ' + result.numOfPages + ' страниц успешно загружены');
        }

        this.fetchData();//обновим данны

      }).catch(e => {
        this.isImportZip = false;
        console.log(e);
        this.$notify.error('Ошибки при обработке файла');
      });
    },

    onInputUpload() {
      this.$refs['input-upload'].click();
    },

    onSaveHelpItem(data) {
      let savedItem = new HelpItem();
      savedItem.htmlContent = data.content;
      savedItem.itemKey = data.itemKey;
      this.helpApi.setContent(savedItem.itemKey, savedItem)
        .then(x => {
          this.$notify.success('Данные успешно сохранены');
          this.onSelectTreeItem(this.selectedItem);//обновим отрисовку справки по выбранному узлу (может не совпадать с сохраняемым узлом savedItem)
        })
        .catch(e => {
          console.log(e);
        });
    },

    onDeleteHelpItem(data) {
      this.helpApi.deleteHelpContent(data).then(x => {
        this.onSelectTreeItem(this.selectedItem);//обновим отрисовку справки по выбранному узлу
      });
    },
  },

  computed: {

    ...mapGetters(['checkPermissions']),

    helpItem() {
      return this.selectedItem;
    },

    editable() {
      //наличие прав на редактирование, или запрет на редактирование страницы
      return (this.checkPermissions(['HELP_EDIT']) && !(this.selectedItem.itemKey && this.selectedItem.itemKey.includes("NO_")));
    }
  },


};
</script>
