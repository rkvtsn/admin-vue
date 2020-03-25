<template>

  <panel-showable title="Фильтры">
    <nic-form :autoheight="false"
              newline>
      <div class="NicForm__Filter">
        <slot></slot>
      </div>
      <div slot="footer">
        <div class="NicForm__BottomToolbar">
          <button class="btn btn-primary"
                  @click.stop.prevent="$emit('apply')">Применить
          </button>
          <button class="btn btn-default"
                  @click.stop.prevent="$emit('cancel')">Очистить
          </button>
        </div>
      </div>
    </nic-form>

  </panel-showable>

</template>

<style lang="scss">
.NicForm .NicForm__Filter {
  > .NicForm__Component {
    margin-right: 20px !important;
    display: inline-block;
    // width: 180px;
    // max-width: 180px;
    // min-width: 180px;
    vertical-align: top;
    margin: 0;
    padding: 0;
    &:last-child {
      margin-right: 0 !important;
    }
  }
}
</style>

<script>
export default {
  components: {
    'panel-showable': () => import('@/js/components/PanelShowable')
  },
  name: 'panel-filter'
};
</script>

