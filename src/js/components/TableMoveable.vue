<template>
  <div class="form-group row listbox">
    <div class="col col-lg-10">
      <table width="100%">
        <tr valign="top">
          <td width="45%">
            <h3>{{ headers[0] }}</h3>
          </td>
          <td>
          </td>
          <td width="45%">
            <h3>{{ headers[1] }}</h3>
          </td>
        </tr>
        <tr valign="top">
          <td>
            <div class="table-wrapper">
              <div class="table-scroll">
                <nic-table v-model="selectedItem" :data="sourceProp" :columns="columns"
                           type="table-bordered" selectable="selectable">
                </nic-table>
              </div>
            </div>
          </td>
          <td valign="middle" align="center">
            <div>
              <button @click.prevent="remove" :disabled="!selectedSubItem" class="btn btn-default btn-sprite">
                <i class="sprite sprite-small sprite-carret-left"></i>
              </button>
            </div>
            <div>
              <button @click.prevent="assign" :disabled="!selectedItem" class="btn btn-default btn-sprite">
                <i class="sprite sprite-small sprite-carret-right"></i>
              </button>
            </div>
            <div>
              <button @click.prevent="clear" class="btn btn-default btn-sprite">
                <i class="sprite sprite-small sprite-max-left"></i>
              </button>
            </div>
            <div>
              <button @click.prevent="fill" class="btn btn-default btn-sprite">
                <i class="sprite sprite-small sprite-max-right"></i>
              </button>
            </div>
          </td>
          <td>
            <div class="table-wrapper">
              <div class="table-scroll">
                <nic-table v-model="selectedSubItem" :data="targetProp" :columns="columns"
                          type="table-bordered" selectable="selectable">
                </nic-table>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'table-moveable',
  data: function() {
    return {
      selectedItem: null,
      selectedSubItem: null,
      index: 2
    };
  },
  props: {
    source: {
      type: Array,
      default: () => []
    },
    target: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    headers: {
      type: Array,
      default: () => ['Все', 'Назначенные']
    }
  },
  methods: {
    findWithAttr(array, attr, value) {
      for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
          return i;
        }
      }
      return -1;
    },
    move(f, t, e) {
      if (e) {
        t.push(e);
        // Фильтрация по id
        // f = f.filter(r => r.id !== e.id)
        // Не работает на FF 24
        // let i = f.findIndex(x => x.id === e.id)

        // let i = this.findWithAttr(f, 'id', e.id)
        // if (i > -1) f.splice(i, 1)
      } else {
        // Конкатенация массивов
        // t = t.concat(f)
        [].push.apply(t, f);
        // Очистка массива
        // f = []
        f.splice(0, f.length);
      }
      this.selectedItem = null;
      this.selectedSubItem = null;
    },
    clear() {
      this.move(this.target, this.source);
    },
    fill() {
      this.move(this.source, this.target);
    },
    remove() {
      this.move(this.target, this.source, this.selectedSubItem);
    },
    assign() {
      this.move(this.source, this.target, this.selectedItem);
    },
    sync() {
      for (let e of this.target) {
        let i = this.findWithAttr(this.source, 'id', e.id);
        if (i > -1) {
          this.source.splice(i, 1);
        }
      }
    },
    sync2(t, s) {
      for (let e of t) {
        let i = this.findWithAttr(s, 'id', e.id);
        if (i > -1) {
          s.splice(i, 1);
        }
      }
    }
  },
  computed: {
    sourceProp() {
      return this.source;
    },
    targetProp() {
      return this.target;
    }
  },
  // Запускается при this.move()
  // Печалька...
  watch: {
    'targetProp'() {
      this.sync2(this.target, this.source);
    },
    'sourceProp'() {
      this.sync2(this.source, this.target);
    }
  }
};
</script>
