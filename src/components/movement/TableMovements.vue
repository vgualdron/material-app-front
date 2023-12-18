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
          placeholder="Buscar movimiento"
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div
        class="col-3
        text-center"
      >
        <q-btn
          color="primary"
          label="Generar"
          @click="showForm()"
          :disabled="!validatedPermissions.create.status"
          :title="validatedPermissions.create.title"
        />
      </div>
    </div>
    <q-table
      :grid="$q.screen.xs"
      :data="data"
      :columns="columns"
      :filter="filter"
      :pagination="pagination"
      class="q-mt-md"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <div>
            <q-btn
              color="white"
              text-color="black"
              field="print"
              icon="print"
              :disabled="!validatedPermissions.print.status"
              :title="validatedPermissions.print.title"
              @click="print(props.row.id, props.row.consecutive)"
            />
            <q-btn
              class="q-ml-xs"
              color="red"
              text-color="white"
              field="delete"
              icon="delete"
              :disabled="!validatedPermissions.delete.status"
              :title="validatedPermissions.delete.title"
              @click="showConfirm(props.row.id, 'D')"
            />
          </div>
        </q-td>
      </template>
      <!--items for small screens-->
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
        >
          <q-card>
            <q-list bordered separator>
              <q-item v-ripple>
                <q-item-section>
                  <template
                    v-for="column in columns"
                  >
                    <q-item-label
                      v-if="column.visible"
                      :key="column.name + '-label'"
                    >
                        {{column.label}}
                    </q-item-label>
                    <q-item-label
                      v-if="column.visible"
                      caption
                      :key="column.name + '-value'"
                    >
                      {{ props.row[column.field]}}
                    </q-item-label>
                  </template>
                </q-item-section>
                <q-item-section side>
                  <div>
                    <q-btn
                      round
                      icon="print"
                      size="xs"
                      color="white"
                      text-color="black"
                      :disabled="!validatedPermissions.print.status"
                      :title="validatedPermissions.print.title"
                      @click="print(props.row.id, props.row.consecutive)"
                    />
                  </div>
                  <div>
                    <q-btn
                      round
                      icon="delete"
                      size="xs"
                      color="red"
                      text-color="white"
                      :disabled="!validatedPermissions.delete.status"
                      :title="validatedPermissions.delete.title"
                      @click="showConfirm(props.row.id, 'D')"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
           </q-card>
        </div>
      </template>
    </q-table>
    <form-movements
      ref="formMovementsReference"
      :showNotificationsRef="showNotification"
      :listMovementsMountedRef="listMovementsMounted"
      :printRef="print"
    />
    <q-dialog v-model="confirm.show" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar :icon="confirm.icon" :color="confirm.iconColor" text-color="white"></q-avatar>
          <span class="q-ml-sm">¿Esta seguro de {{confirm.action}} este registro?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Cancelar"
            color="primary"
            outline class="col"
            v-close-popup
            @click="confirm.show = false"
          />
          <q-btn
            label="Aceptar"
            @click="submit"
            color="primary"
            class="col q-ml-sm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import FormMovements from 'components/movement/FormMovements.vue';
import movementTypes from '../../store/modules/movement/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      route: '/materialSettlement',
      name: 'Liquidación (Material)',
      columns: [
        {
          name: 'consecutive',
          label: 'Consecutivo',
          align: 'left',
          field: 'consecutive',
          sortable: true,
          visible: true,
        },
        {
          name: 'date',
          align: 'left',
          label: 'Fecha Generación',
          field: 'date',
          sortable: true,
          visible: true,
        },
        {
          name: 'startDate',
          align: 'left',
          label: 'Fecha Inicio',
          field: 'startDate',
          sortable: true,
          visible: true,
        },
        {
          name: 'finalDate',
          align: 'left',
          label: 'Fecha Final',
          field: 'finalDate',
          sortable: true,
          visible: true,
        },
        {
          name: 'actions',
          label: 'Acciones',
          align: 'center',
          visible: false,
        },
      ],
      confirm: {
        show: false,
        action: '',
        icon: '',
        iconColor: '',
        type: '',
      },
      movement: null,
      pagination: {
        rowsPerPage: 50,
      },
      filter: '',
      data: [],
    };
  },
  async mounted() {
    this.validateLogin();
  },
  computed: {
    ...mapState(movementTypes.PATH, [
      'movements',
      'responseMessages',
      'status',
      'movementsToPrint',
    ]),
    validatedPermissions() {
      const statusCreate = havePermission('movement.create');
      const statusPrint = havePermission('movement.print');
      const statusDelete = havePermission('movement.delete');
      return {
        create: {
          title: statusCreate ? 'Generar Movimientos' : 'No tiene permisos para generar movimientos',
          status: statusCreate,
        },
        print: {
          title: statusPrint ? 'Imprimir Movimiento' : 'No tiene permisos para imprimir movimientos',
          status: statusPrint,
        },
        delete: {
          title: statusDelete ? 'Eliminar Movimiento' : 'No tiene permisos para eliminar movimientos',
          status: statusDelete,
        },
      };
    },
  },
  methods: {
    ...mapActions(movementTypes.PATH, {
      listMovements: movementTypes.actions.LIST_MOVEMENTS,
      printMovement: movementTypes.actions.PRINT_MOVEMENT,
      generatePrintDocument: movementTypes.actions.GENERATE_PRINT_DOCUMENT,
      deleteMovement: movementTypes.actions.DELETE_MOVEMENT,
    }),
    async listMovementsMounted() {
      showLoading('Cargando Movimientos ...', 'Por favor, espere', true);
      await this.listMovements();
      if (this.status === true) {
        this.data = this.movements.map((element) => ({
          ...element,
        }));
        this.$q.loading.hide();
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
        this.$q.loading.hide();
      }
    },
    async showForm() {
      showLoading('Preparando Formulario ...', 'Por favor, espere', true);
      this.$refs.formMovementsReference.showModal();
      this.$q.loading.hide();
    },
    async print(id, consecutive) {
      showLoading('Imprimiendo movimientos ...', 'Por favor, espere', true);
      await this.printMovement(id);
      if (this.status === true) {
        this.generatePrintDocument({
          data: this.movementsToPrint,
          fileName: consecutive,
        });
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      }
      this.listMovementsMounted();
      this.$q.loading.hide();
    },
    showConfirm(id, type) {
      if (id !== null) {
        if (type === 'D') {
          this.confirm.action = 'eliminar';
          this.confirm.icon = 'delete';
          this.confirm.iconColor = 'red';
          this.confirm.type = type;
          this.movement = id;
        }
        this.confirm.show = true;
      }
    },
    async submit() {
      if (this.confirm.type !== null && this.confirm.type !== '') {
        if (this.confirm.type === 'D') {
          showLoading('Eliminando movimiento ...', 'Por favor, espere', true);
          await this.deleteMovement(this.movement);
          this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
          if (this.status === true) {
            this.confirm.show = false;
          }
        }
        this.listMovementsMounted();
      }
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    validateLogin() {
      if (localStorage.getItem('tokenMC')) {
        this.listMovementsMounted();
      } else {
        this.$router.push('/');
      }
    },
  },
  components: {
    FormMovements,
  },
};
</script>
