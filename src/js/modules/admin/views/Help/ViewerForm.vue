<template>
  <nicedit :help-item="helpItem"
           :editable="editable"
           @on-save-help-item="onSaveHelpItem">
  </nicedit>
</template>

<script>

import { mapGetters } from 'vuex';
import HelpApi from '@/js/modules/admin/api/HelpItemApi.js';
import HelpItem from "../../models/HelpItem";

export default {

  components: {
    nicedit: () => import('./Nicedit')
  },

  data() {
    return {
      nicedit: 'nicedit',
      helpApi: new HelpApi(),
      selectedItem: new HelpItem(),
      editable: false,
    };
  },


  created() {
    this.$emit('hide-header');
    this.fetchData();
  },


  methods: {
    fetchData() {
      this.editable = this.checkPermissions(['HELP_EDIT']) && !(this.selectedItem.itemKey && this.selectedItem.itemKey.includes("NO_"));

      let helpKey = this.$route.params.helpKey;  //здесь только helpKey, без данных метки ##

      this.helpApi.getContent(helpKey).then(x => {
        this.selectedItem.htmlContent = x;
        this.selectedItem.itemKey = helpKey;

        /*
        // Здесь все загрузилось. Но переход к метке не работает, т.к. не отрисовалось
        if (this.$route.hash.indexOf("##") != -1) { //здесь данныe метки ##
          helpKey = helpKey.concat(this.$route.hash);
          let target = document.getElementById(helpKey);
          console.log(target)
          let targetOffset = target.offsetTop;  //смещение метки, для скролла
          console.info(targetOffset);
          window.scrollTo(0, target.offsetTop - 40); // 40px - height of header
        } */
      });
    },

    onSaveHelpItem(data) {
      this.selectedItem.htmlContent = data.content;
      this.helpApi.setContent(this.selectedItem.itemKey, this.selectedItem)
        .then(x => {
          this.$notify.success('Данные успешно сохранены');
          this.fetchData();
        })
        .catch(e => {
          console.log(e);
        });
    }

  },



  computed: {
    ...mapGetters(['checkPermissions']),

    helpItem() {
      return this.selectedItem;
    }

  },



};

</script>
