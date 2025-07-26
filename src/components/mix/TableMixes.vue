<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-9 text-center">
        <div class="row">
          <q-input
            outlined
            label="Fecha de la mezcla"
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
            @click="showModalListMixes = true;"
            class="q-ml-md">
            Consultar mezclas de la fecha
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
            <q-icon size="xs" name="edit" />
            {{ props.row.amount }}
            <q-popup-edit :value="props.row.amount" v-slot="scope" buttons
              @input="val => saveItem('amount', val)">
              <q-input type="number" v-model.number="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="percentage" :props="props">
            {{ props.row.percentage }}%
          </q-td>
          <q-td key="actions" :props="props" auto-width>
            <q-btn icon="delete" type="reset" color="primary" flat size="sm"
              class="col q-ml-sm" @click="deleteRow(props)" />
          </q-td>
        </q-tr>
      </template>
      <template v-slot:bottom-row>
        <q-tr class="total-row text-weight-bolder">
          <q-td key="material" class="text-h6 text-left">
            <q-icon size="xs" name="edit" />
            {{ mixItem.material.label }}
            <q-popup-edit
              :value="mixItem.material.label"
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
            {{ mixItem.unit }}
          </q-td>
          <q-td key="amount" class="text-h6">
            {{ mixItem.amount }}
          </q-td>
          <q-td key="percentage" class="text-h6">
            {{ mixItem.percentage }}%
          </q-td>
          <q-td auto-width class="text-h6">
            <q-btn size="sm" color="green" @click="addItem()" icon="add">
              Nueva fila
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-btn
      size="md"
      color="green"
      @click="saveMix()"
      class="q-mt-md">
      Guardar mezcla
    </q-btn>
    <modal-list-mixes
      v-if="showModalListMixes"
      v-model="showModalListMixes"
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
import ModalListMixes from './ModalListMixes.vue';

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
      mixItem: {
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
      showModalListMixes: false,
    };
  },
  async mounted() {
    this.date = this.dateNow();

    this.isLoadingTable = true;
    await this.fetchYards({ id: 0, displayAll: 1 });
    await this.getMaterialsByYard(this.currentYard);

    this.title = `MEZCLA PARA ${this.yards.find(({ id }) => id === parseInt(this.currentYard, 10)).name}`;

    const item1 = this.materials.find(({ code }) => code === 'C01');
    this.addItem({
      material: {
        label: item1.name,
        value: item1.material,
      },
      unit: item1.unit,
      percentage: 40,
      amount: 40,
      actions: null,
    });

    const item2 = this.materials.find(({ code }) => code === 'C03');
    this.addItem({
      material: {
        label: item2.name,
        value: item2.material,
      },
      unit: item2.unit,
      percentage: 40,
      amount: 40,
      actions: null,
    });

    const item3 = this.materials.find(({ code }) => code === 'G01');
    this.addItem({
      material: {
        label: item3.name,
        value: item3.material,
      },
      unit: item3.unit,
      percentage: 20,
      amount: 20,
      actions: null,
    });

    const mixItem = this.materials.find(({ code }) => code === 'M01');
    this.mixItem = {
      material: {
        label: mixItem.name,
        value: mixItem.material,
      },
      unit: mixItem.unit,
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
    updateMixItem() {
      const amountTotal = this.items.reduce((total, item) => total + item.amount, 0);
      const percentageTotal = this.items.reduce((total, item) => total + parseFloat(item.percentage), 0);
      this.mixItem = {
        ...this.mixItem,
        amount: Number.parseFloat(amountTotal).toFixed(2),
        percentage: Number.parseFloat(percentageTotal).toFixed(2),
      };
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    clickRow(data) {
      this.itemSelected = { ...data.row };
      this.indexSelected = data.rowIndex;
    },
    addItem(data) {
      if (data) {
        this.items.push({ ...data });
      } else {
        this.items.push({ ...this.copyItem });
      }
    },
    deleteRow(data) {
      this.items.splice(data.rowIndex, 1);
    },
    async saveItem(field, value) {
      this.items[this.indexSelected][field] = value;

      const amountTotal = this.items.reduce((total, item) => total + item.amount, 0);
      const rows = this.items.map((item) => ({ ...item, percentage: Number.parseFloat(((item.amount / amountTotal) * 100)).toFixed(2) }));
      this.items = [...rows];
      this.updateMixItem();
    },
    async saveOut(field, value) {
      this.mixItem[field] = value;
    },
    async saveMix() {
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
        type: 'D',
      }));
      materials.push({
        material: this.mixItem.material.value,
        amount: this.mixItem.amount,
        type: 'A',
      });
      const data = {
        date: formatDateToSave(this.date),
        yard: this.currentYard,
        origin: 'M',
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
    ModalListMixes,
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
