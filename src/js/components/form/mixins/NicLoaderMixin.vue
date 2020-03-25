<script>

  export default {
    components: {
      'nic-loader': () => import('./../NicLoader')
    },
    props: {
      isLoading: {
        type: Boolean,
        default: false
      }
    },
    // methods: {
    //   setLoading(status) {
    //     this.isLoading = status
    //   },
    //   toggle() {
    //     this.isLoading !== this.isLoading
    //   }
    // },
  };

</script>
