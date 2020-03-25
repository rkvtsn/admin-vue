var u = window.u;

const
  /**
   * Display Copyright information (version and more).
   * How to use it:
   *
   *  @example
   *  <nic-copyright></nic-copyright>
   *
   * - In `config.json` on the server needable *company* and *version* properties.
   * - In $root sould be exist API.config() method for getting URL to `config.json`.
   * - If u need change some style for company or version part,
   *  then change CSS class (.company, .version)
   * @class nic.Copyright
   */
  Copyright = {
    name: 'nic-copyright',
    template: `
      <div class="copyright">
        &copy;
        <span class="company">{{cmp}}</span>
        <span class="version" v-if="ver">Версия: {{ver}}</span>
      </div>
    `,

    props: ['version', 'company'],
    data: function () {
      return {
        cmp: this.company,
        ver: this.version
      }
    },

    mounted() {
      !this.company && (this.cmp = this.$root.company);
      !this.version && (this.ver = this.$root.version);
      if (!this.cmp && !this.ver) {
        fetch(this.$root.API.config())
          .then(r => r.json())
          .then(d => {
            this.cmp = d.company;
            this.ver = d.version;
          })
      }
    }
  },

  CopyrightPlugin = {
    install(Vue) {
      Vue.component(Copyright.name, Copyright);
    }
  }
;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(CopyrightPlugin);
}
