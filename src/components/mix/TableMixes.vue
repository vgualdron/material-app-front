<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-9 text-center">
      </div>
    </div>
    <q-table
      :data="data"
      :columns="columns"
      row-key="amount"
      :loading="isLoadingTable"
      :filter="filter"
      hide-bottom
      separator="cell"
      class="q-mt-md">
      <template v-slot:body="props">
        <q-tr :props="props" @click="clickRow(props)" class="row-item">
          <q-td key="material" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.material }}
            <q-popup-edit :value="props.row.material" v-slot="scope" buttons
              @input="val => save('material', val)">
              <q-input v-model="scope.value" dense autofocus />
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
            <q-icon size="xs" name="edit" />
            {{ props.row.percentage }}%
            <q-popup-edit :value="props.row.percentage" v-slot="scope" buttons
              @input="val => save('percentage', val)">
              <q-input type="number" v-model.number="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="costU" :props="props">
            {{ props.row.costU }}
          </q-td>
          <q-td key="costT" :props="props">
            {{ props.row.costT }}
          </q-td>
          <q-td key="actions" :props="props" auto-width>
            <q-btn icon="delete" type="reset" color="primary" flat size="sm"
              class="col q-ml-sm" @click="deleteRow(props)" />
          </q-td>
        </q-tr>
      </template>
      <template v-slot:bottom-row>
        <q-tr class="total-row text-weight-bolder">
          <q-td key="material" class="text-h6">
            {{ mixItem.material }}
          </q-td>
          <q-td key="unit" class="text-h6">
            {{ mixItem.unit }}
          </q-td>
          <q-td key="amount" class="text-h6">
            {{ mixItem.amount }}
          </q-td>
          <q-td key="percentage" class="text-h6">
            {{ mixItem.percentage }}
          </q-td>
          <q-td key="costU" class="text-h6">
            {{ mixItem.costU }}
          </q-td>
          <q-td key="costT" class="text-h6">
            {{ mixItem.costT }}
          </q-td>
          <q-td auto-width class="text-h6">
            <q-btn size="sm" color="green" @click="addItem()" icon="add">
              Nueva fila
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script>
// import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      isLoadingTable: false,
      items: [],
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
          name: 'costU',
          required: true,
          label: 'Costo unitario',
          align: 'center',
        },
        {
          name: 'costT',
          required: true,
          label: 'Costo Total',
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
        material: null,
        unit: null,
        amount: 0,
        percentage: 0,
        costU: 0,
        costT: 0,
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
  mounted() {
    this.addItem();
  },
  computed: {
    data() {
      return [...this.items];
    },
    mixItem() {
      if (this.items.length === 0) {
        return { ...this.copyItem };
      }
      const amountTotal = this.items.reduce((total, item) => total + item.amount, 0);
      const percentageTotal = this.items.reduce((total, item) => total + item.percentage, 0);
      const costUTotal = this.items.reduce((total, item) => total + item.costU, 0);
      const costTTotal = this.items.reduce((total, item) => total + item.costT, 0);
      return {
        material: null,
        amount: amountTotal,
        percentage: percentageTotal,
        costU: costUTotal,
        costT: costTTotal,
      };
    },
  },
  methods: {
    clickRow(data) {
      this.itemSelected = { ...data.row };
      this.indexSelected = data.rowIndex;
    },
    addItem() {
      this.items.push({ ...this.copyItem });
    },
    deleteRow(data) {
      this.items.splice(data.rowIndex, 1);
    },
    async save(field, value) {
      this.items[this.indexSelected][field] = value.value || value;
    },
  },
};
</script>
<style scoped>
  .total-row {
    background: mistyrose;;
    text-align: center;
  }
  .row-item {
    background: mintcream;
    text-align: center;
  }
</style>
