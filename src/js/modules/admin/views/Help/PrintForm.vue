
<style lang="scss">
.nic-edit {
  padding: 10px;

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

}
</style>


<template>
  <div class="nic-edit">
    <div class="contentWrapper">
      <div id="contentScroll" class="contentScroll">
        <div id="htmlElement" class="htmlElement" v-html="htmlContent"/>
      </div>
    </div>


  </div>
</template>

<script>

  import HelpApi from '@/js/modules/admin/api/HelpItemApi.js';

  export default {

    data() {
      return {
        helpApi: new HelpApi(),
        htmlContent: '',
      };
    },

    created() {
      this.fetchData();
    },

    methods:{
      fetchData() {

        let helpKey = this.$route.params.helpKey;

        this.helpApi.getContent(helpKey).then(x => {
          this.htmlContent = x;
          //проставим адрес сервера для загрузки картинок
          this.htmlContent = this.htmlContent.replace("../helps/get/image?helpImageKey=", Vue.http.options.root + "/helps/get/image?helpImageKey=");
          //проставим адрес клиента для работы ссылок
          this.htmlContent = this.htmlContent.replace("../#/helpitems/", window.location + "/#/helpitems/");

          this.$nextTick(() => {
            window.print();
          });
        })
      }
    }

  };


</script>
