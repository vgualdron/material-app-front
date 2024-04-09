<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-9 text-center">
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
            {{ props.row.material.name }}
            <q-popup-edit
              :value="props.row.material.name"
              v-slot="scope"
              @input="val => save('material', val)"
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
              @input="val => save('amount', val)">
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
            {{ mixItem.material.name }}
            <q-popup-edit
              :value="mixItem.material.name"
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
    };
  },
  async mounted() {
    this.isLoadingTable = true;
    await this.fetchYards({ id: 0, displayAll: 1 });
    await this.getMaterialsByYard(this.currentYard);

    this.title = `MEZCLA PARA ${this.yards.find(({ id }) => id === parseInt(this.currentYard, 10)).name}`;

    const item1 = this.materials.find(({ code }) => code === 'C01');
    this.addItem({
      material: {
        ...item1,
      },
      unit: item1.unit,
      percentage: 40,
      amount: 40,
      actions: null,
    });

    const item2 = this.materials.find(({ code }) => code === 'C03');
    this.addItem({
      material: {
        ...item2,
      },
      unit: item2.unit,
      percentage: 40,
      amount: 40,
      actions: null,
    });

    const item3 = this.materials.find(({ code }) => code === 'G01');
    this.addItem({
      material: {
        ...item3,
      },
      unit: item3.unit,
      percentage: 20,
      amount: 20,
      actions: null,
    });
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
      return this.materials.map(({ id, name }) => ({ label: name, value: id }));
    },
    mixItem() {
      if (this.items.length === 0) {
        return { ...this.copyItem };
      }
      const mixItem = this.materials.find(({ code }) => code === 'M01');
      const amountTotal = this.items.reduce((total, item) => total + item.amount, 0);
      const percentageTotal = this.items.reduce((total, item) => total + parseFloat(item.percentage), 0);
      return {
        material: { ...mixItem },
        unit: mixItem.unit,
        amount: Number.parseFloat(amountTotal).toFixed(2),
        percentage: Number.parseFloat(percentageTotal).toFixed(2),
      };
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
    async save(field, value) {
      let val = value;
      if (field === 'material') {
        val = this.materials.find(({ id }) => id === parseInt(val.value, 10));
      }
      this.items[this.indexSelected][field] = val.value || val;

      const amountTotal = this.items.reduce((total, item) => total + item.amount, 0);
      const rows = this.items.map((item) => ({ ...item, percentage: Number.parseFloat(((item.amount / amountTotal) * 100)).toFixed(2) }));
      this.items = [...rows];
    },
    async saveOut(field, value) {
      console.log(value);
      let val = value;
      if (field === 'material') {
        val = this.materials.find(({ id }) => id === parseInt(val.value, 10));
      }
      this.mixItem[field] = val.value || val;
    },
    async saveMix() {
      showLoading('Guardando mezcla ...', 'Por favor, espere', true);
      const materials = this.items.map((item) => ({
        material: item.material.material,
        amount: item.amount,
        type: 'D',
      }));
      materials.push({
        material: this.mixItem.material.material,
        amount: this.mixItem.amount,
        type: 'A',
      });
      const data = {
        yard: this.currentYard,
        origin: 'M',
        material: [
          ...materials,
        ],
      };
      console.log(data);
      await this.saveAdjustmentMixOrRiddle(data);
      this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      this.$q.loading.hide();

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
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
