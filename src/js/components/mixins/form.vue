
<script>
import { API } from '@/js/addons/api';

export default {


  data() {
    return {
      $controller: null,
      model: null,
      api: null,
    };
  },


  async activated() {
    this.ID = this.$route.params.id;
    this.init();
    await this.beforeFetch();
    await this.fetchData();
  },


  methods: {

    init() {
    },

    async fetchData() {
      if (this.ID) {
        await this.onEditForm();
      } else {
        await this.onCreateForm();
      }
    },

    async beforeFetch() { },

    async onEditForm() { },

    async onCreateForm() { },

    getModel(params) {
      return this.$model;
    },

    getApi(params) {
      return this.$api;
    },

    getData(params) {
      return this.$list;
    },

    reset() {

    },

    goBack() {
      if (this.$route.params.prev) {
        this.$router.push(this.$route.params.prev);
      } else {
        this.$router.go(-1);
      }
      this.reset();
    },

    onSubmit() {

    },

  }


};
</script>
