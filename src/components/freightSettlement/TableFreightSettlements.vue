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
          placeholder="Buscar liquidación"
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
          label="Liquidar"
          @click="showSettlementForm(null, 'S', null)"
          :disabled="!validatedPermissions.settle.status"
          :title="validatedPermissions.settle.title"
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
              @click="print(props.row.id)"
            />
            <q-btn
              class="q-ml-xs"
              color="green"
              field="addInfo"
              icon="post_add"
              :disabled="!validatedPermissions.addInfo.status"
              :title="validatedPermissions.addInfo.title"
              @click="showForm(props.row.id)"
            />
            <q-btn
              class="q-ml-xs"
              color="primary"
              field="edit"
              icon="edit"
              :disabled="!validatedPermissions.edit.status"
              :title="validatedPermissions.edit.title"
              @click="showSettlementForm(props.row.id, 'U', props.row.consecutive)"
            />
            <q-btn
              class="q-ml-xs"
              color="red"
              field="delete"
              icon="delete"
              :disabled="!validatedPermissions.delete.status"
              :title="validatedPermissions.delete.title"
              @click="showModal(props.row.id, 'D', props.row.consecutive)"
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
                      @click="print(props.row.id)"
                    />
                  </div>
                  <div class="q-mt-xs">
                    <q-btn
                      round
                      icon="post_add"
                      size="xs"
                      color="green"
                      :disabled="!validatedPermissions.addInfo.status"
                      :title="validatedPermissions.addInfo.title"
                      @click="showForm(props.row.id)"
                    />
                  </div>
                  <div>
                    <q-btn
                      round
                      icon="edit"
                      size="xs"
                      color="primary"
                      text-color="white"
                      :disabled="!validatedPermissions.edit.status"
                      :title="validatedPermissions.edit.title"
                      @click="showSettlementForm(props.row.id, 'U', props.row.consecutive)"
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
                      @click="showModal(props.row.id, 'D', props.row.consecutive)"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
           </q-card>
        </div>
      </template>
    </q-table>
    <!-- CONFIRM DIALOG -->
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
    <form-freight-settlements
      ref="formMaterialSettlementReference"
      :showNotificationsRef="showNotification"
      :listFreightSettlementsMountedRef="listFreightSettlementsMounted"
    />
    <form-freight-settle
      ref="formFreightSettleReference"
      :showNotificationsRef="showNotification"
      :listFreightSettlementsMountedRef="listFreightSettlementsMounted"
    />
    <manage-movements
      ref="manageMovementsReference"
      :showNotificationsRef="showNotification"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import FormFreightSettlements from 'components/freightSettlement/FormFreightSettlements.vue';
import FormFreightSettle from 'components/freightSettlement/FormFreightSettle.vue';
import ManageMovements from 'components/materialSettlement/ManageMovements.vue';
import freightSettlementTypes from '../../store/modules/freightSettlement/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      route: '/freightSettlement',
      name: 'Liquidación (Flete)',
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
          label: 'Fecha',
          field: 'date',
          sortable: true,
          visible: true,
        },
        {
          name: 'third',
          align: 'left',
          label: 'Tercero',
          field: 'third',
          sortable: true,
          visible: true,
        },
        {
          name: 'subtotalSettlement',
          align: 'left',
          label: 'Subtotal',
          field: 'subtotalSettlement',
          sortable: true,
          visible: true,
        },
        {
          name: 'retentions',
          align: 'left',
          label: 'Retención',
          field: 'retentions',
          sortable: true,
          visible: true,
        },
        {
          name: 'totalSettle',
          align: 'left',
          label: 'Total',
          field: 'totalSettle',
          sortable: true,
          visible: true,
        },
        {
          name: 'invoice',
          align: 'left',
          label: 'Factura',
          field: 'invoice',
          sortable: true,
          visible: true,
        },
        {
          name: 'internalDocument',
          align: 'left',
          label: 'Doc. Interno',
          field: 'internalDocument',
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
    ...mapState(freightSettlementTypes.PATH, [
      'settlements',
      'responseMessages',
      'status',
      'settlement',
      'settlementToPrint',
      'movements',
    ]),
    validatedPermissions() {
      const statusSettle = havePermission('materialSettlement.settle');
      const statusPrint = havePermission('materialSettlement.print');
      const statusAddInfo = havePermission('materialSettlement.addInformation');
      const statusEdit = havePermission('materialSettlement.update');
      const statusDelete = havePermission('materialSettlement.delete');
      return {
        settle: {
          title: statusSettle ? 'Liquidar material' : 'No tiene permisos para liquidar materiales',
          status: statusSettle,
        },
        print: {
          title: statusPrint ? 'Imprimir Liquidación' : 'No tiene permisos para imprimir liquidación de material',
          status: statusPrint,
        },
        addInfo: {
          title: statusAddInfo ? 'Agregar información' : 'No tiene permisos para agregar información de liquidación de material',
          status: statusAddInfo,
        },
        edit: {
          title: statusEdit ? 'Editar liquidación' : 'No tiene permisos para editar liquidaciones de material',
          status: statusEdit,
        },
        delete: {
          title: statusDelete ? 'Eliminar liquidación' : 'No tiene permisos para eliminar liquidaciones de material',
          status: statusDelete,
        },
      };
    },
  },
  methods: {
    ...mapActions(freightSettlementTypes.PATH, {
      listFreightSettlements: freightSettlementTypes.actions.LIST_FREIGHT_SETTLEMENTS,
      printSettlement: freightSettlementTypes.actions.PRINT_SETTLEMENT,
      generatePrintDocument: freightSettlementTypes.actions.GENERATE_PRINT_DOCUMENT,
      getSettlement: freightSettlementTypes.actions.GET_FREIGHT_SETTLEMENT,
      validateMovements: freightSettlementTypes.actions.VALIDATE_MOVEMENTS,
      getSettledTickets: freightSettlementTypes.actions.GET_SETTLED_TICKETS,
      deleteSettlement: freightSettlementTypes.actions.DELETE_FREIGHT_SETTLEMENT,
    }),
    async listFreightSettlementsMounted() {
      showLoading('Cargando Liquidaciones ...', 'Por favor, espere', true);
      await this.listFreightSettlements();
      if (this.status === true) {
        this.data = this.settlements.map((element) => ({
          ...element,
        }));
        this.$q.loading.hide();
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
        this.$q.loading.hide();
      }
    },
    async showForm(id) {
      showLoading('Preparando Formulario ...', 'Por favor, espere', true);
      await this.getSettlement(id);
      if (this.status === true) {
        this.$refs.formMaterialSettlementReference.showModal(id, { ...this.settlement });
      } else {
        this.showNotification(this.responseMessages, 'red', 'top-right', 5000);
      }
      this.$q.loading.hide();
    },
    async print(id) {
      showLoading('Imprimiendo Liquidacion ...', 'Por favor, espere', true);
      await this.printSettlement(id);
      if (this.status === true) {
        this.generatePrintDocument(this.settlementToPrint);
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      }
      this.$q.loading.hide();
    },
    async showSettlementForm(id, type, consecutive) {
      if (type === 'S') {
        showLoading('Preparando formulario ...', 'Por favor, espere', true);
        this.$refs.formFreightSettleReference.showModal(type);
      } else {
        showLoading('Preparando formulario ...', 'Por favor, espere', true);
        await this.validateMovements(id);
        if (this.status === true) {
          if (this.movements.length === 0) {
            await this.getSettledTickets(id);
            if (this.status === true) {
              this.$refs.formFreightSettleReference.showModal(type);
            } else {
              this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
            }
          } else {
            this.$refs.manageMovementsReference.showModal(this.movements, consecutive);
          }
        } else {
          this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        }
      }
    },
    async showModal(id, action, consecutive) {
      this.settlementId = null;
      showLoading('Preparando formulario ...', 'Por favor, espere', true);
      await this.validateMovements(id);
      if (this.status === true) {
        if (this.movements.length === 0) {
          this.settlementId = id;
          this.confirm.icon = action === 'D' ? 'delete' : '';
          this.confirm.iconColor = action === 'D' ? 'red' : '';
          this.confirm.action = action === 'D' ? 'eliminar' : '';
          this.confirm.type = action;
          this.confirm.show = true;
        } else {
          this.$refs.manageMovementsReference.showModal(this.movements, consecutive);
        }
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      }
      this.$q.loading.hide();
    },
    async submit() {
      if (this.confirm.type !== null && this.confirm.type !== '') {
        if (this.confirm.type === 'D') {
          showLoading('Eliminando liquidación ...', 'Por favor, espere', true);
          await this.deleteSettlement(this.settlementId);
          this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
          if (this.status === true) {
            this.confirm.show = false;
          }
        }
        this.listFreightSettlementsMounted();
      }
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    validateLogin() {
      if (localStorage.getItem('tokenMC')) {
        this.listFreightSettlementsMounted();
      } else {
        this.$router.push('/');
      }
    },
  },
  components: {
    FormFreightSettlements,
    FormFreightSettle,
    ManageMovements,
  },
};
</script>
