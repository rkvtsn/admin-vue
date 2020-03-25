
<style lang="scss">
  .nic-edit {
    padding: 10px;

    .showModeDiv {
      width:100%;
      height:100%;
      padding-bottom:50px;
    }
    .contentWrapper {
      overflow:auto;
      width:100%;
      height:100%;
      text-align:left;
      box-sizing:border-box;
      -moz-box-sizing: border-box;
      padding-bottom:60px;
    }
    .contentScroll {
      height:100%;
      overflow:auto;
    }
    .editModeDiv {
      padding:0;
      margin:0;
      width:99%;
      height:100%;
      min-width:700px;
    }
    .nicEditPanel {
      width:100%;
      height:30px;
    }
    .nicEditContentWrapper {
      padding-bottom:70px;
      height:100%;
      width:100%;
      box-sizing:border-box;
      -moz-box-sizing: border-box;
    }
    .nicEditContentScroll {
      overflow-y:auto;
      overflow-x:hidden;
      height:100%;
      width:100%;
      border-width: 0px 1px 1px 1px;
      border-style: solid;
      border-color: #BBBBBB;
      min-height: 400px;
      max-height: 700px;
    }
    .nicEditInstance {
      min-height: 400px;
      padding: 5px;
    }
  }
</style>


<template>
  <div class="nic-edit">

    <nic-window title="Выберите объект для ссылки:"
                @close="showModalLinkDialog = false"
                :active="showModalLinkDialog">
      <widget-select-link @select-help-tree-elem="selectLink"
                          @submit="showModalLinkDialog = false"
                          @cancel="showModalLinkDialog = false" />
    </nic-window>

    <nic-window title="Выберите объект для ссылки:"
                @close="showModalLabelDialog = false"
                :active="showModalLabelDialog">
      <nic-input label="Наименование метки"
                 :maxlength="250"
                 v-model="labelName"></nic-input>
      <div slot="footer" class="editButtonsPanel" align="right">
        <button class="btn btn-default btn-widget" @click.prevent="onLabelDialogSubmit">Сохранить</button>
        <button class="btn btn-default btn-widget" @click.prevent="showModalLabelDialog = false">Отмена</button>
      </div>
    </nic-window>


    <h3 v-if="helpItemName">{{helpItemName}}</h3>
    <div id="showModeDiv" class="showModeDiv" v-show="editMode==false ">
      <div class="contentWrapper">
        <div id="contentScroll" class="contentScroll">
          <div id="htmlElement" class="htmlElement" v-html="getUpdatedHtml"/>
          <span v-show="htmlContent==''">Материалы информационной поддержки для выбранной страницы еще не созданы...</span>
        </div>
      </div>

      <div id="showButtonsPanel" class="showButtonsPanel" align="right" v-show="editable">
        <button id="editButton" class="btn btn-default btn-widget" @click.prevent="editHelpItem()" v-if="!htmlContent==''">Редактировать</button>
        <button id="removeButton" class="btn btn-default btn-widget" @click.prevent="confirmDelete()" v-if="!htmlContent==''">Удалить</button>
        <button id="printButton" class="btn btn-default btn-widget" @click.prevent="printHelp()" v-if="!htmlContent==''">Печать</button>
        <button class="btn btn-default btn-widget" @click.prevent="editHelpItem()" v-if="htmlContent==''">Создать</button>
      </div>
    </div>
    <div id="editModeDiv" class="editModeDiv" v-show="editMode==true">
      <div id="nicEditPanel" class="nicEditPanel"></div>
      <div class="nicEditContentWrapper">
        <div class="nicEditContentScroll">
          <div id="nicEditInstance" class="nicEditInstance">
          </div>
        </div>
      </div>
      <div sclass="editButtonsPanel" align="right">
        <button class="btn btn-default btn-widget" @click.prevent="saveHelpItem">Сохранить</button>
        <button class="btn btn-default btn-widget" @click.prevent="cancel">Отмена</button>
      </div>
    </div>

  </div>
</template>


<script>

  import models from '@/js/models';
  import Event from '@/js/nic/components/event';
  import {
    niceditInitNicEditor,
    niceditGetHtmlContent,
    niceditSetHtmlContent
  } from '@/js/nic/components/nicedit';


  export default {

    components: {
      'modal-window': () => import('@/js/components/ModalWindow'),
      'widget-select-link': () => import('./SelectHelpTreeItem')
    },

    props: {
      helpItem: {
        type: models.admin.HelpItem
      },
      editable: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        htmlContent: '',
        helpItemKey: '',
        helpItemName: '',
        editMode: false,
        labelName: '',
        showModalLabelDialog: false,
        showModalLinkDialog: false
      };
    },
    mounted(){
      //старт и подписка на события nicedit.js
      niceditInitNicEditor();
      Event.$on('niceditOnLinkDialog', data => this.niceditOnLinkDialogHandler());
      Event.$on('niceditOnLabelDialog', data => this.niceditOnLabelDialogHandler());
    },

    methods: {

      editHelpItem(){
        this.editMode = true;
        this.updateHtmlEditor();
        this.$forceUpdate();
      },

      cancel() {
        this.editMode = false;
        this.$forceUpdate();
      },

      confirmDelete() {
        this.showMessageConfirm('Вы действительно хотите удалить страницу справки\n' +
          'без возможности восстановления?',
          (ok) => {
            this.$emit('on-delete-help-item', this.helpItemKey);
            ok();
          });
      },

      saveHelpItem() {
        this.htmlContent = niceditGetHtmlContent();

        // удаляем некорректно удаленные в редакторе метки
        this.deleteDamagedLabels();

        //сделаем метки невидимыми
        this.htmlContent = this.htmlContent.replace('style="color:red;">#</span>', 'style="color:white;">#</span>');

        //удалим адрес сервера для загрузки картинок
        this.htmlContent = this.htmlContent.replace(Vue.http.options.root + "/helps/get/image?helpImageKey=", "../helps/get/image?helpImageKey=");
        //удалим адрес клиента из ссылок
        this.htmlContent = this.htmlContent.replace(window.location +"/#/helpitems/", "../#/helpitems/");

        this.$emit('on-save-help-item', {
          content: this.htmlContent,
          itemKey: this.helpItemKey
        });

        this.editMode = false; //вроде должно перерисоваться при обновлении дерева в EditorForm...
      },

      //удаление некорректно удаленных в редакторе меток (удалился только текст в <span>)
      deleteDamagedLabels() {
        let correctedHtmlContent = "";

        if (this.htmlContent.includes("style=\"color:red;\"></span>")) {
          let arr = this.htmlContent.split("style=\"color:red;\"></span>");
          // разделили на все куски с метками; последний кусок не обрабатываем т.к. все что касается метки - в предыдущем куске
          for (let i = 0; i < arr.length-1; i++){
            let idxOfSpan = arr[i].lastIndexOf("<span id=\"" + this.helpItem.getItemKey());
            if (idxOfSpan >= 0)
              arr[i] = arr[i].substring(0, idxOfSpan);
            correctedHtmlContent = correctedHtmlContent + arr[i];
          }
          correctedHtmlContent = correctedHtmlContent + arr[arr.length-1];  //добавляем последний кусок
        }
        if (correctedHtmlContent.length>0)
          this.htmlContent = correctedHtmlContent;
      },

      updateHtmlEditor() {

        //сделаем метки видимыми
        this.htmlContent = this.htmlContent.replace("style=\"color:white;\">#</span>", "style=\"color:red;\">#</span>");
        niceditSetHtmlContent({htmlContent: this.htmlContent, helpItemKey: this.helpItemKey});

      },

      selectLink(data){
        Event.$emit('niceditOnSubmitLinkDialog', {
          url: window.location.origin +'/#/helpitems/'+ data.itemKey,
          linkTitle: data.itemName,

        });
      },

      niceditOnLinkDialogHandler() {
        this.showModalLinkDialog = true;
      },

      onLabelDialogSubmit(){
        this.showModalLabelDialog = false;
        Event.$emit('niceditOnSubmitLabelDialog', {
          labelName: this.labelName,
          parentItemKey: this.helpItemKey,
          key: Math.random().toString(16).substr(2)
        });
      },

      niceditOnLabelDialogHandler() {
        this.labelName = "";
        this.showModalLabelDialog = true;

      },

      printHelp() {
        let routeData = this.$router.resolve({ name: 'HelpPrint.vue', params: { helpKey: this.helpItemKey } });
        try {
          var wnd = window.open(routeData.href, 'PRINTHELP', 'width=1000,height=500,toolbar=no,menubar=no,status=no,resizable=yes,help=no');
          wnd.focus();
        } catch (myException) {
          alert('Ошибка открытия окна. Проверьте настройки блокировки всплывающих окон в браузере!');
        }
      },

    },

    computed: {

      // TODO: bad practice - 'computed' не может изменять состояние, это "геттер"!!!
      getUpdatedHtml() {
        if (!this.editMode) { //это условие закрывает обновление при перемещении по дереву справки, если справка находится в режиме редактирования
          this.htmlContent = this.helpItem.htmlContent;
          this.helpItemKey = this.helpItem.itemKey; //сохраняем, т.к. this.helpItem меняется при перемещении по дереву, поскольку редактор не модальный
          this.helpItemName = this.helpItem.itemName;
        }
        //проставим адрес сервера для загрузки картинок
        this.htmlContent = this.htmlContent.replace("../helps/get/image?helpImageKey=", Vue.http.options.root + "/helps/get/image?helpImageKey=");
        //проставим адрес клиента для работы ссылок
        this.htmlContent = this.htmlContent.replace("../#/helpitems/", window.location +"/#/helpitems/");

        return this.htmlContent;
      }
    }

  };


</script>
