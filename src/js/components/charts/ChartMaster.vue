<style lang="scss" src="./style.scss"></style>

<template>
  <div class="chart-master">

    <modal-window height="auto"
                  :active="showModalWindow"
                  title="Выбор мероприятий"
                  @close="closeModalWindow()">
      <keep-alive>
        <component v-model="checkedOffers"
                   @submit="submitSelectedOffers()"
                   @cancel="closeModalWindow()"
                   :is="modalWindowComponentName"></component>
      </keep-alive>
    </modal-window>

    <nic-form :autoheight="false"
              :bottom-toolbar="false">
      <button class="btn btn-default"
              @click.prevent="chooseOffers()">Выбрать мероприятия</button>
      <button class="btn btn-primary"
              :disabled="checkedOffers.length == 0"
              @click.prevent="refreshChart">Провести оценку</button>
      <button class="btn btn-default"
              :disabled="offers.length === 0"
              @click.prevent="downloadURI">Выгрузить</button>

      <div class="nic-form-group">
        <div class="NicCheckbox NicForm__Component">
          <label for="label_range">Учитывать заданный период:</label>
          <input type="checkbox"
                 id="label_range"
                 v-model="isRange" />
        </div>
        <nic-select label="Год начала"
                    no-null
                    v-model.number="start"
                    @input="() => {
                      if (finish < start) {finish = start + 1}
                    }"
                    :data="$util.range(1990, 2100)"></nic-select>

        <nic-select label="Год окончания"
                    no-null
                    v-model.number="finish"
                    @input="() => {
                      if (finish < start) {start = finish - 1}
                    }"
                    :data="$util.range(1990, 2100)" />

      </div>

      <!-- 
      <button>Выбрать показатели оценки</button> -->

      <!-- <div class="nic-form-group">
        <nic-input type="textarea" label="Заголовок"></nic-input>

        <nic-combobox label="Формат числовых данных"></nic-combobox>

        <nic-checkbox-group label="Вывод"></nic-checkbox-group>
      </div> -->

      <!-- <div class="nic-form-group">
        <nic-select label="Тип диаграммы"
                    no-null
                    v-model="type"
                    :data="types">
        </nic-select>
      </div> -->

      <div class="nic-form-group">

        <div v-for="(criterion, index) of criteriaList"
             :key="index">

          <div class="NicCheckbox NicForm__Component">
            <input type="checkbox"
                   :id="`label_${index}`"
                   v-model="criteriaList[index].enabled" />
            <label style="padding-left: 10px;"
                   :for="`label_${index}`">{{criterion.name}}</label>
          </div>

          <div class="NicForm__Row">
            <div class="NicForm__Component"
                 style="flex: 4;">
              <input style="border: none;"
                     v-model="criteriaList[index].value"
                     step="1"
                     min="0"
                     max="20"
                     type="range" />
            </div>
            <nic-input type="number"
                       width="36px"
                       v-model="criteriaList[index].value"
                       :default="10"
                       :min="0"
                       :max="20" />
          </div>
        </div>
      </div>
    </nic-form>

    <div class="chart-port">
      <bar-chart v-show="series.datasets && series.datasets.length"
                 ref="chart"
                 :chart-data="series">
      </bar-chart>
      <div class="chart-table">
        <nic-table class="table table-bordered"
                   v-show="checkedOffers.length > 0"
                   :data="offers"
                   :columns="tableColumns"></nic-table>
      </div>
    </div>

  </div>
</template>

<script>
import { downloadFile } from '@/js/addons/requests';
import BarChart from './BarChart.js';

export default {
  name: 'chart-master',
}
</script>


