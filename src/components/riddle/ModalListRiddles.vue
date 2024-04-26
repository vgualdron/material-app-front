<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="showDialog"
      persistent
    >
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Cribas del día {{ this.date }}</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-separator />
      <q-card-section
        style="max-height: 60vh"
        class="scroll"
      >
      <q-table
        v-if="adjustments && adjustments.length > 0"
        :data="adjustments"
        :columns="columns"
        row-key="uuid"
        separator="cell"
        class="q-mt-md"
        hide-bottom>
        <template v-slot:body="props">
          <q-tr :props="props" class="row-item">
            <q-td key="info" :props="props">
              <span v-for="material in props.row.material" :key="`item-list-${material.id}`">
                <p v-if="material.type === 'D'">
                  <b>{{ material.type }} - {{ material.name }} - {{ material.amount }}</b>
                </p>
                <p v-else>
                  {{ material.type }} - {{ material.name }} - {{ material.amount }}
                </p>
              </span>
            </q-td>
            <q-td key="actions" :props="props" auto-width>
              <q-btn icon="delete" type="reset" color="primary" flat size="sm"
                class="col q-ml-sm" @click="deleteRow(props.row.uuid)" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-banner v-else class="bg-grey-3">
        No hay cribas para la fecha seleccionada, seleccione otra fecha.
      </q-banner>
      </q-card-section>
    </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import adjustmentTypes from '../../store/modules/adjustment/types';
import { formatDateToSave } from '../../helpers/formatDateToSave';

export default {
  data() {
    return {
      isLoading: false,
      columns: [
        {
          name: 'info',
          required: true,
          label: 'Mezcla',
          align: 'left',
        },
        {
          name: 'actions',
          required: true,
          label: 'Acciones',
          align: 'center',
        },
      ],
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
    },
    yard: {
      type: String,
    },
  },
  async mounted() {
    showLoading('Consultando cribas ...', 'Por favor, espere', true);
    const data = {
      startDate: formatDateToSave(this.date),
      endDate: formatDateToSave(this.date),
      yard: this.yard,
      origin: 'C',
    };
    await this.listAdjustmentMixOrRiddle(data);
    this.$q.loading.hide();
  },
  computed: {
    ...mapState(adjustmentTypes.PATH, [
      'adjustments',
    ]),
    showDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
  methods: {
    ...mapActions(adjustmentTypes.PATH, {
      listAdjustmentMixOrRiddle: adjustmentTypes.actions.LIST_ADJUSTMENTS_MIX_OR_RIDDLE,
      deleteAdjustmentMixOrRiddle: adjustmentTypes.actions.DELETE_ADJUSTMENT_MIX_OR_RIDDLE,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    async deleteRow(uuid) {
      showLoading('Eliminando mezcla ...', 'Por favor, espere', true);
      await this.deleteAdjustmentMixOrRiddle(uuid);
      const data = {
        startDate: formatDateToSave(this.date),
        endDate: formatDateToSave(this.date),
        yard: this.yard,
        origin: 'M',
      };
      await this.listAdjustmentMixOrRiddle(data);
      this.$q.loading.hide();
    },
  },
};
</script>
