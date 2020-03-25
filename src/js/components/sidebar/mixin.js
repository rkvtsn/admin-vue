export const itemMixin = {
  props: {
    level: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      active: false,
      childActive: false
    };
  },
  created() {
    this.active = this.item && this.item.meta.name ? this.isLinkActive(this.item) : false;
    this.childActive = this.item && this.item.children ? this.isChildActive(this.item.children) : false;
    this.show = this.item && this.item.children ? this.isChildActive(this.item.children) : false;
  },
  methods: {
    toggleDropdown() {
      this.show = !this.show;
    },
    isLinkActive(item) {
      if (this.$route) {
        return (this.$route.path.indexOf(item.meta.url || item.path) !== -1);
      } else {
        return item.href == window.location.pathname;
      }
    },
    isChildActive(child) {
      for (let item of child) {
        if (this.isLinkActive(item)) {
          return true;
        }
        if (item.children) {
          if (this.isChildActive(item.children)) {
            return true;
          }
        }
      }
      return false;
    }
  },
  computed: {
    isRouterLink() {
      return this.$router && this.item && this.item.meta.name !== undefined;
    },
    padding() {
      return {
        'padding-left': `${this.level * 12}px`
      };
    }
  },
  watch: {
    $route() {
      this.active = this.item && this.item.meta.name ? this.isLinkActive(this.item) : false;
      this.childActive = this.item && this.item.children ? this.isChildActive(this.item.children) : false;
    }
  },
};
