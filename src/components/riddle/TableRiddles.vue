<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-9 text-center">
        <div class="row">
          <q-input
            outlined
            label="Fecha de la criba"
            v-model="date"
            lazy-rules
            :rules="filterRules.date"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qStartDateProxy.show()"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qStartDateProxy"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="date"
                    mask="DD/MM/YYYY"
                    @input="$refs.qStartDateProxy.hide()"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-btn
            size="md"
            color="blue"
            @click="showModalListRiddles = true;"
            class="q-ml-md">
            Consultar cribas de la fecha
          </q-btn>
        </div>
      </div>
    </div>
    <q-table
      :title="title"
      :data="data"
      :columns="columns"
      row-key="amount"
      :loading="isLoadingTable"
      :filter="filter"
      separator="cell"
      class="q-mt-md"
      hide-bottom>
      <template v-slot:body="props">
        <q-tr :props="props" @click="clickRow(props)" class="row-item">
          <q-td key="material" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.material.label }}
            <q-popup-edit
              :value="props.row.material.label"
              v-slot="scope"
              @input="val => saveItem('material', val)"
              buttons>
              <q-select
                outlined
                v-model="scope.value"
                :options="optionsMaterials"/>
            </q-popup-edit>
          </q-td>
          <q-td key="unit" :props="props">
            {{ props.row.unit }}
          </q-td>
          <q-td key="amount" :props="props">
            {{ props.row.amount }}
          </q-td>
          <q-td key="percentage" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.percentage }}%
            <q-popup-edit :value="props.row.percentage" v-slot="scope" buttons
              @input="val => saveItem('percentage', val)">
              <q-input type="number" v-model.number="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="actions" :props="props" auto-width>
            <q-btn icon="delete" type="reset" color="primary" flat size="sm"
              class="col q-ml-sm" @click="deleteRow(props)" />
          </q-td>
        </q-tr>
      </template>
      <template v-slot:top-row>
        <q-tr class="total-row text-weight-bolder">
          <q-td key="material" class="text-h6 text-left">
            <q-icon size="xs" name="edit" />
            {{ riddleItem.material.label }}
            <q-popup-edit
              :value="riddleItem.material.label"
              v-slot="scope"
              @input="val => saveOut('material', val)"
              buttons>
              <q-select
                outlined
                v-model="scope.value"
                :options="optionsMaterials"/>
            </q-popup-edit>
          </q-td>
          <q-td key="unit" class="text-h6">
            {{ riddleItem.unit }}
          </q-td>
          <q-td key="amount" class="text-h6">
            <q-icon size="xs" name="edit" />
            {{ riddleItem.amount }}
            <q-popup-edit :value="riddleItem.amount" v-slot="scope" buttons
              @input="val => saveOut('amount', val)">
              <q-input type="number" v-model.number="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="percentage" class="text-h6">
            {{ riddleItem.percentage }}%
          </q-td>
          <q-td auto-width class="text-h6">
            <q-btn size="sm" color="green" @click="addItem()" icon="add">
              Nueva fila
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-banner v-if="disabledSave" inline-actions class="q-mt-md text-white bg-red">
      El Porcentaje Total debe estar en 100%.
    </q-banner>
    <q-btn
      size="md"
      color="green"
      @click="saveRiddle()"
      :disabled="disabledSave"
      class="q-mt-md">
      Guardar criba
    </q-btn>
    <modal-list-riddles
      v-if="showModalListRiddles"
      v-model="showModalListRiddles"
      :yard="currentYard"
      :date="date"/>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import commonTypes from '../../store/modules/common/types';
import yardTypes from '../../store/modules/yard/types';
import materialTypes from '../../store/modules/material/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import adjustmentTypes from '../../store/modules/adjustment/types';
import { formatDateToSave } from '../../helpers/formatDateToSave';
import ModalListRiddles from './ModalListRiddles.vue';

export default {
  data() {
    return {
      isLoadingTable: false,
      items: [],
      title: '',
      columns: [
        {
          name: 'material',
          required: true,
          label: 'Material',
          align: 'left',
        },
        {
          name: 'unit',
          required: true,
          label: 'Unidad',
          align: 'center',
        },
        {
          name: 'amount',
          required: true,
          label: 'Cantidad',
          align: 'center',
        },
        {
          name: 'percentage',
          required: true,
          label: 'Porcentaje %',
          align: 'center',
        },
        {
          name: 'actions',
          required: true,
          label: 'Acciones',
          align: 'center',
        },
      ],
      filter: '',
      itemSelected: {},
      indexSelected: 0,
      copyItem: {
        material: {},
        unit: 'T',
        amount: 0,
        percentage: 0,
        actions: null,
      },
      riddleItem: {
        material: {},
        unit: 'T',
        amount: 0,
        percentage: 0,
        actions: null,
      },
      newItem: {},
      optionsStatus: [
        {
          label: 'Activo',
          value: 1,
        },
        {
          label: 'Inactivo',
          value: 0,
        },
      ],
      filterRules: {
        date: [
          (val) => (!!val) || 'La fecha es requerida',
        ],
      },
      date: '',
      showModalListRiddles: false,
      disabledSave: false,
    };
  },
  async mounted() {
    this.date = this.dateNow();

    this.isLoadingTable = true;
    await this.fetchYards({ id: 0, displayAll: 1 });
    await this.getMaterialsByYard(this.currentYard);

    this.title = `CRIBA PARA ${this.yards.find(({ id }) => id === parseInt(this.currentYard, 10)).name}`;

    const item1 = this.materials.find(({ code }) => code === 'Q02');
    this.addItems({
      material: {
        label: item1.name,
        value: item1.material,
      },
      unit: item1.unit,
      percentage: 80,
      amount: 80,
      actions: null,
    });

    const item2 = this.materials.find(({ code }) => code === 'Q03');
    this.addItems({
      material: {
        label: item2.name,
        value: item2.material,
      },
      unit: item2.unit,
      percentage: 9,
      amount: 9,
      actions: null,
    });

    const item3 = this.materials.find(({ code }) => code === 'Q04');
    this.addItems({
      material: {
        label: item3.name,
        value: item3.material,
      },
      unit: item3.unit,
      percentage: 11,
      amount: 11,
      actions: null,
    });

    const riddleItem = this.materials.find(({ code }) => code === 'Q01');
    this.riddleItem = {
      material: {
        label: riddleItem.name,
        value: riddleItem.material,
      },
      unit: riddleItem.unit,
      percentage: 100,
      amount: 100,
    };
    this.isLoadingTable = false;
  },
  computed: {
    ...mapState(commonTypes.PATH, [
      'currentYard',
    ]),
    ...mapState(yardTypes.PATH, [
      'yards',
    ]),
    ...mapState(materialTypes.PATH, [
      'materials',
    ]),
    ...mapState(adjustmentTypes.PATH, [
      'responseMessages',
      'status',
    ]),
    data() {
      return [...this.items];
    },
    optionsMaterials() {
      return this.materials.map(({ material, name }) => ({ label: name, value: material }));
    },
  },
  methods: {
    ...mapActions(yardTypes.PATH, {
      fetchYards: yardTypes.actions.LIST_YARDS,
    }),
    ...mapActions(materialTypes.PATH, {
      getMaterialsByYard: materialTypes.actions.GET_MATERIALS_BY_YARD,
    }),
    ...mapActions(adjustmentTypes.PATH, {
      saveAdjustmentMixOrRiddle: adjustmentTypes.actions.SAVE_ADJUSTMENT_MIX_OR_RIDDLE,
    }),
    dateNow() {
      const objectDate = new Date();
      const day = objectDate.getDate();
      let month = objectDate.getMonth() + 1;

      if (month < 10) {
        month = `0${month}`;
      }

      const year = objectDate.getFullYear();
      const date = `${day}/${month}/${year}`;
      return date;
    },
    updateRiddleItem() {
      const amountTotal = this.riddleItem.amount;
      const items = [...this.items];
      const newItems = items.map((item) => ({
        ...item,
        amount: (amountTotal * item.percentage) / 100,
      }));

      const percentageTotal = newItems.reduce((total, item) => total + parseFloat(item.percentage), 0);

      if (percentageTotal < 100) {
        this.disabledSave = true;
        this.riddleItem.percentage = percentageTotal;
        return;
      }

      if (percentageTotal > 100) {
        return;
      }

      this.items = newItems;
      this.disabledSave = percentageTotal > 100;
      this.riddleItem = {
        ...this.riddleItem,
        percentage: Number.parseFloat(percentageTotal).toFixed(2),
      };

      // Actualiza el valor de globalPercentage
      this.globalPercentage = this.riddleItem.percentage;
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    clickRow(data) {
      this.itemSelected = { ...data.row };
      this.indexSelected = data.rowIndex;
    },
    addItems(data) {
      if (this.riddleItem.percentage === 100) {
        this.$q.dialog({
          title: 'Advertencia',
          message: 'Debe modificar los porcentajes primero',
          ok: 'OK',
        });
        return;
      }
      if (data) {
        this.items.push({ ...data });
      } else {
        this.items.push({ ...this.copyItem });
      }
    },
    addItem(data) {
      const percentageTotal = this.items.reduce((total, item) => total + parseFloat(item.percentage), 0);
      if (percentageTotal >= 100) {
        this.$q.dialog({
          title: 'Advertencia',
          message: 'Debe modificar los porcentajes primero',
          ok: 'OK',
        });
        return;
      }
      const newPercentage = 100 - percentageTotal;
      if (data) {
        this.items.push({ ...data, percentage: newPercentage });
      } else {
        this.items.push({ ...this.copyItem, percentage: newPercentage });
      }
      this.riddleItem.percentage = 100;
      this.disabledSave = !this.disabledSave;
    },
    deleteRow(data) {
      this.items.splice(data.rowIndex, 1);
      const percentageTotal = this.items.reduce((total, item) => total + parseFloat(item.percentage), 0);
      this.riddleItem.percentage = percentageTotal;
      this.disabledSave = !this.disabledSave;
    },
    async saveItem(field, value) {
      // Haz una copia del estado actual de los elementos
      const originalItems = JSON.parse(JSON.stringify(this.items));

      // Actualiza el campo con el nuevo valor
      this.items[this.indexSelected][field] = value;

      // Llama a updateRiddleItem() para actualizar los demás campos
      this.updateRiddleItem();

      // Calcula el total de los porcentajes
      const percentageTotal = this.items.reduce((total, item) => total + parseFloat(item.percentage), 0);

      // Si el total de los porcentajes es mayor a 100, muestra un cuadro de diálogo y revierte los elementos a su estado original
      if (percentageTotal > 100) {
        this.$q.dialog({
          title: 'Advertencia',
          message: 'El total de los porcentajes no puede ser mayor a 100',
          ok: 'OK',
        });
        this.items = originalItems;
      }
    },
    async saveOut(field, value) {
      this.riddleItem[field] = value;
      this.updateRiddleItem();
    },
    async saveRiddle() {
      // Verifica si todos los elementos tienen un valor para 'material'
      let isValid = true;
      this.items.forEach((item) => {
        if (!item.material.value) {
          isValid = false;
        }
      });

      if (!isValid) {
        this.$q.dialog({
          title: 'Advertencia',
          message: 'La formula No tiene Material Asignado',
          ok: 'OK',
        });
        return;
      }
      showLoading('Guardando mezcla ...', 'Por favor, espere', true);
      const materials = this.items.map((item) => ({
        material: item.material.value,
        amount: item.amount,
        type: 'A',
      }));
      materials.push({
        material: this.riddleItem.material.value,
        amount: this.riddleItem.amount,
        type: 'D',
      });
      const data = {
        date: formatDateToSave(this.date),
        yard: this.currentYard,
        origin: 'C',
        material: [
          ...materials,
        ],
      };
      await this.saveAdjustmentMixOrRiddle(data);
      this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      this.$q.loading.hide();
    },
  },
  components: {
    ModalListRiddles,
  },
};
</script>
<style scoped>
  .total-row {
    background: rgb(185, 229, 207);
    text-align: center;
  }
  .row-item {
    background: rgba(184, 218, 224, 0.959);
    text-align: center;
  }
</style>
