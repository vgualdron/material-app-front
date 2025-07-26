<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-9 text-center">
        <q-input
          dense
          debounce="400"
          color="primary"
          v-model="filter"
          class="q-ml-xs"
          placeholder="Buscar Mezcla"
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Tabla de ajustes -->
    <q-table
      :grid="$q.screen.xs"
      :data="data"
      :columns="columns"
      :filter="filter"
      :pagination="pagination"
      class="q-mt-md"
      :rows="data"
      :row-class="rowClass"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div>
            <!-- Botón de eliminar con confirmación -->
            <q-btn
              class="q-ml-xs"
              color="red"
              field="delete"
              icon="delete"
              @click="confirmDelete(props.row.uuid)"
            />
          </div>
        </q-td>
      </template>
      <!-- Para pantallas pequeñas -->
      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
          <q-card>
            <q-list bordered separator>
              <q-item v-ripple>
                <q-item-section>
                  <template v-for="column in columns">
                    <q-item-label v-if="column.visible" :key="column.name + '-label'">
                      {{ column.label }}
                    </q-item-label>
                    <q-item-label v-if="column.visible" caption :key="column.name + '-value'">
                      {{ props.row[column.field] }}
                    </q-item-label>
                  </template>
                </q-item-section>
                <q-item-section side>
                  <div>
                    <q-btn
                      round
                      icon="edit"
                      size="xs"
                      color="primary"
                      @click="showForm(props.row.id, 'E')"
                    ></q-btn>
                  </div>
                  <div class="q-mt-xs">
                    <q-btn
                      round
                      icon="delete"
                      size="xs"
                      color="red"
                      @click="confirmDelete(props.row.uuid)"
                    ></q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>

    <!-- Componente de formulario para mezclar -->
    <form-mixes
      ref="formMixReference"
      :showNotificationsRef="showNotification"
      :listMixesMountedRef="listMixesMounted"
    />

    <!-- Diálogo de confirmación para eliminar -->
    <q-dialog v-model="deleteDialogVisible">
      <q-card>
        <q-card-section>
          <div class="text-h6">¿Estás seguro de que deseas eliminar esta mezcla?</div>
        </q-card-section>

        <q-card-actions>
          <q-btn flat label="Cancelar" color="primary" @click="deleteDialogVisible = false" />
          <q-btn flat label="Eliminar" color="negative" @click="deleteRow" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import FormMixes from 'components/mix/FormMixes.vue';
import { mapState, mapActions } from 'vuex';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import adjustmentTypes from '../../store/modules/adjustment/types';

export default {
  data() {
    return {
      filter: '',
      pagination: {
        rowsPerPage: 50,
      },
      columns: [
        {
          name: 'id',
          required: true,
          label: 'ID',
          align: 'left',
          field: 'id',
          sortable: true,
          visible: true,
        },
        {
          name: 'uuid',
          required: true,
          label: 'UUID',
          align: 'left',
          field: 'uuid',
          sortable: true,
          visible: false,
        },
        {
          name: 'origin',
          required: true,
          label: 'Origen',
          align: 'left',
          field: 'origin',
          sortable: true,
          visible: true,
        },
        {
          name: 'type',
          required: true,
          label: 'Tipo',
          align: 'left',
          field: 'type',
          sortable: true,
          visible: true,
        },
        {
          name: 'yard',
          required: true,
          label: 'Planta',
          align: 'left',
          field: 'yard',
          sortable: true,
          visible: true,
        },
        {
          name: 'material',
          required: true,
          label: 'Material',
          align: 'left',
          field: 'material',
          sortable: true,
          visible: true,
        },
        {
          name: 'date',
          required: true,
          label: 'Fecha',
          align: 'left',
          field: 'date',
          sortable: true,
          visible: true,
        },
        {
          name: 'amount',
          required: true,
          label: 'Cantidad',
          align: 'left',
          field: 'amount',
          sortable: true,
          visible: true,
        },
        {
          name: 'actions',
          required: true,
          label: 'Acciones',
          align: 'center',
          field: 'actions',
          visible: true,
        },
      ],
      data: [],
      selectedUuid: null, // Para almacenar el uuid seleccionado
      deleteDialogVisible: false, // Controla la visibilidad del diálogo de confirmación
      selectedUuidToDelete: null, // UUID del elemento seleccionado para eliminar
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
    showLoading('Consultando mezclas ...', 'Por favor, espere', true);
    await this.listAdjustments({ origin: 'C' });
    if (this.status === true) {
      this.data = this.adjustments;
    } else {
      this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      this.data = [];
    }
    this.$q.loading.hide();
  },
  computed: {
    ...mapState(adjustmentTypes.PATH, ['adjustments', 'responseMessages', 'status']),
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
      listAdjustments: adjustmentTypes.actions.LIST_ADJUSTMENTS,
      deleteAdjustmentMixOrRiddle: adjustmentTypes.actions.DELETE_ADJUSTMENT_MIX_OR_RIDDLE,
    }),

    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },

    // Abre el diálogo de confirmación para eliminar
    confirmDelete(uuid) {
      this.selectedUuidToDelete = uuid;
      this.deleteDialogVisible = true;
    },

    // Elimina el ajuste usando uuid
    async deleteRow() {
      showLoading('Eliminando mezcla ...', 'Por favor, espere', true);
      await this.deleteAdjustmentMixOrRiddle(this.selectedUuidToDelete);
      // Recarga la página para reflejar los cambios
      window.location.reload();

      // Cierra el diálogo de confirmación de eliminación
      this.deleteDialogVisible = false;
    },

    async showForm(id, type) {
      showLoading('Preparando formulario ...', 'Por favor, espere', true);
      if (id === null) {
        this.$refs.formMixReference.showModal(id, null, type);
      } else {
        await this.getAdjustment(id);
        if (this.status === true) {
          this.$refs.formMixReference.showModal(id, { ...this.adjustment }, type);
        } else {
          this.$q.loading.hide();
          this.showNotification(this.responseMessages, 'red', 'top-right', 5000);
        }
      }
    },

    listMixesMounted() {
      this.mounted();
    },
  },
  components: {
    FormMixes,
  },
};
</script>
