<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="modal.show"
      persistent
    >
      <q-card style="width: 97vw; max-width: 97vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6"> {{ title }} </div>
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
          style="max-height: 85vh"
          class="scroll"
        >
          <div class="row" v-if="actionType === 'S'">
            <q-toggle
              size="md"
              v-model="showFilter"
              checked-icon="visibility"
              color="green"
              label="Ver filtro"
              unchecked-icon="visibility_off"
            />
          </div>
          <q-slide-transition>
            <div v-show="showFilter" v-if="actionType === 'S'">
              <q-form
                @submit="onFilterSubmit"
                class="q-gutter-md"
              >
                <div class="row">
                  <div
                    class="col col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pr-md-xs"
                  >
                    <q-input
                      outlined
                      label="Fecha Inicio"
                      :disable="disableInputs"
                      v-model="filter.startDate"
                      lazy-rules
                      :rules="filterRules.startDate"
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
                              v-model="filter.startDate"
                              mask="DD/MM/YYYY"
                              :options="date =>  filter.finalDate ? date <= filter.finalDate.split('/').reverse().join('/') : true"
                              @input="$refs.qStartDateProxy.hide(), getConveyorCompanies()"
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
                  </div>
                  <div
                    class="col col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pr-md-xs q-pl-md-xs q-pt-sm-xs q-pt-xs-xs q-pt-md-none"
                  >
                    <q-input
                      outlined
                      label="Fecha Fin"
                      :disable="disableInputs"
                      v-model="filter.finalDate"
                      lazy-rules
                      :rules="filterRules.finalDate"
                      hide-bottom-space
                      clearable
                      mask="##/##/####"
                      @click="$refs.qFinalDateProxy.show()"
                    >
                      <template v-slot:append>
                        <q-icon
                          name="event"
                          class="cursor-pointer"
                        >
                          <q-popup-proxy
                            ref="qFinalDateProxy"
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="filter.finalDate"
                              mask="DD/MM/YYYY"
                              :options="date =>  filter.startDate ? date >= filter.startDate.split('/').reverse().join('/') : true"
                              @input="$refs.qFinalDateProxy.hide(), getConveyorCompanies()"
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
                  </div>
                  <div
                    class="col col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pl-md-xs q-pt-sm-xs q-pt-xs-xs q-pt-md-none"
                  >
                    <q-select
                      outlined
                      v-model="filter.conveyorCompany"
                      use-input
                      clearable
                      input-debounce="0"
                      label="Empresa Transportadora *"
                      :disable="disableInputs"
                      :options="optionConveyorCompany"
                      option-label="name"
                      option-value="id"
                      reactive-rules
                      :rules="filterRules.conveyorCompany"
                      @filter="filterConveyorCompany"
                      hide-bottom-space
                      map-options
                      emit-value
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No hay coincidencias
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>
                <div class="row text-center">
                  <q-btn
                    label="Buscar"
                    type="submit"
                    color="primary"
                    class="col q-ml-sm"
                  />
                </div>
              </q-form>
              <q-separator class = "q-mt-sm"/>
            </div>
          </q-slide-transition>
          <q-table
            :grid="$q.screen.lt.md"
            :data="data"
            :columns="columns"
            class="q-mt-md"
            wrap-cells
            :rows-per-page-options="[0]"
            :hide-pagination="true"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td
                  key="typeName"
                  :props="props"
                >
                  {{ props.row.typeName }}
                </q-td>
                <q-td
                  key="roundTrip"
                  :props="props"
                >
                  <q-checkbox
                    v-if="props.row.type === 'T'"
                    v-model.trim="props.row.roundTrip"
                    :disable="true"
                    outlined
                    dense
                  />
                </q-td>
                <q-td
                  key="date"
                  :props="props"
                >
                  {{ props.row.date }}
                </q-td>
                <q-td
                  key="referralNumber"
                  :props="props"
                >
                  {{ props.row.referralNumber }}
                </q-td>
                <q-td
                  key="receiptNumber"
                  :props="props"
                >
                  {{ props.row.receiptNumber }}
                </q-td>
                <q-td
                  key="material"
                  :props="props"
                >
                  {{ props.row.material }}
                </q-td>
                <q-td
                  key="conveyorCompany"
                  :props="props"
                >
                  {{ props.row.conveyorCompany }}
                </q-td>
                <q-td
                  key="originYard"
                  :props="props"
                >
                  {{ props.row.originYard }}
                </q-td>
                <q-td
                  key="destinyYard"
                  :props="props"
                >
                  {{ props.row.destinyYard }}
                </q-td>
                <q-td
                  key="netWeight"
                  :props="props"
                >
                  {{ props.row.netWeight }}
                </q-td>
                <q-td
                  key="auxNetWeight"
                  :props="props"
                >
                  <template v-if="props.row.type !== 'C'">
                    <template v-if="props.row.settleReceiptWeight === false && props.row.type === 'T'">
                      {{props.row.auxNetWeight}}
                    </template>
                    <template v-else-if="props.row.settleReceiptWeight === true && (props.row.type === 'T' || props.row.type === 'V')">
                      <q-input
                        v-model.trim="props.row.auxNetWeight"
                        :disable="!props.row.settleReceiptWeight"
                        outlined
                        dense
                        @input="formatAuxNetWeight(props.pageIndex, false), recalculateValues(props.pageIndex, props.row.type)"
                        @blur="formatAuxNetWeight(props.pageIndex, true)"
                      />
                    </template>
                  </template>
                </q-td>
                <q-td
                  key="freightPrice"
                  :props="props"
                >
                  <q-input
                    v-model.trim="props.row.freightPrice"
                    outlined
                    dense
                    @input="formatFreightPrice(props.pageIndex, false), recalculateValues(props.pageIndex, props.row.type)"
                    @blur="formatFreightPrice(props.pageIndex, true)"
                  />
                </q-td>
                <q-td
                  key="netPrice"
                  :props="props"
                >
                  {{ props.row.netPrice }}
                </q-td>
                <q-td
                  key="settleReceiptWeight"
                  :props="props"
                >
                  <q-checkbox
                    v-if="props.row.materialUnit !== 'U' && props.row.type !== 'C'"
                    v-model.trim="props.row.settleReceiptWeight"
                    outlined
                    dense
                    @input="resetAuxReceiptWeight(props.row.type, props.pageIndex), recalculateValues(props.pageIndex, props.row.type)"
                  />
                </q-td>
              </q-tr>
            </template>
            <template v-slot:bottom-row v-if="data && data.length > 0">
              <q-tr>
                <q-td
                  class="text-right text-bold"
                  colspan="9"
                >
                  SUBTOTAL
                </q-td>
                <q-td
                  key="subtotalWeight"
                  colspan="1"
                >
                  {{ subtotalWeight }}
                </q-td>
                <q-td
                  colspan="2"
                />
                <q-td
                  key="totalValue"
                  colspan="1"
                >
                  {{ totalValue }}
                </q-td>
                <q-td
                  colspan="1"
                />
              </q-tr>
              <q-tr>
                <q-td
                  class="text-right text-bold"
                  colspan="9"
                >
                  RETENCION EN LA FUENTE
                </q-td>
                <q-td
                  class="text-right text-bold"
                  colspan="1"
                >
                  <q-input
                    v-model.trim="retention"
                    outlined
                    dense
                    @input="formatRetention()"
                    @blur="formatRetention()"
                  />
                </q-td>
                <q-td
                  colspan="2"
                />
                <q-td
                  key="retentionSubtotal"
                  colspan="2"
                >
                  {{ retentionSubtotal }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td
                  class="text-right text-bold"
                  colspan="9"
                >
                  TOTAL
                </q-td>
                <q-td
                  colspan="3"
                />
                <q-td
                  key="totalSettle"
                  colspan="2"
                >
                  {{ totalSettle }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td
                  class="text-right text-bold"
                  colspan="9"
                >
                  OBSERVACION
                </q-td>
                <q-td
                  class="text-right text-bold"
                  colspan="3"
                >
                  <q-input
                    class="q-mt-xs"
                    :input-style="{resize: 'none'}"
                    type="textarea"
                    v-model.trim="observation"
                    outlined
                    :disable="disableInputs"
                    hide-bottom-space
                    rows="3"
                    counter
                    maxlength="600"
                  />
                </q-td>
                <q-td
                  class="text-center text-bold"
                  colspan="2"
                >
                  <q-btn
                    label="Liquidar"
                    color="primary"
                    @click="settle"
                  />
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import thirdTypes from '../../store/modules/third/types';
import freightSettlementTypes from '../../store/modules/freightSettlement/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { removeAccents } from '../../helpers/removeAccents';
import { formatDateToSave } from '../../helpers/formatDateToSave';
import { formatDecimal } from '../../helpers/formatDecimal';

export default {
  data() {
    return {
      modal: {
        show: false,
        title: '',
        type: '',
      },
      actionType: '',
      title: '',
      id: null,
      isLoading: false,
      showFilter: true,
      columns: [
        {
          name: 'typeName',
          label: 'Tipo',
          align: 'left',
          field: 'typeName',
          sortable: true,
          visible: true,
        },
        {
          name: 'roundTrip',
          label: 'Viaje Redondo',
          align: 'center',
          field: 'roundTrip',
          sortable: true,
          visible: true,
        },
        {
          name: 'date',
          label: 'Fecha',
          align: 'left',
          field: 'date',
          sortable: true,
          visible: true,
        },
        {
          name: 'referralNumber',
          label: 'N° Remisión',
          align: 'left',
          field: 'referralNumber',
          sortable: true,
          visible: true,
        },
        {
          name: 'receiptNumber',
          label: 'N° Recibo',
          align: 'left',
          field: 'receiptNumber',
          sortable: true,
          visible: true,
        },
        {
          name: 'material',
          label: 'Material',
          align: 'left',
          field: 'material',
          sortable: true,
          visible: true,
        },
        {
          name: 'conveyorCompany',
          label: 'Emp. Transportadora',
          align: 'left',
          field: 'conveyorCompany',
          sortable: true,
          visible: true,
        },
        {
          name: 'originYard',
          label: 'P. Origen / Proveedor',
          align: 'left',
          field: 'originYard',
          sortable: true,
          visible: true,
        },
        {
          name: 'destinyYard',
          label: 'P. Destino / Cliente',
          align: 'left',
          field: 'destinyYard',
          sortable: true,
          visible: true,
        },
        {
          name: 'netWeight',
          label: 'Cant. Despacho',
          align: 'left',
          field: 'netWeight',
          sortable: true,
          visible: true,
        },
        {
          name: 'auxNetWeight',
          label: 'Cant. Recepción',
          align: 'left',
          field: 'auxNetWeight',
          sortable: true,
          visible: true,
        },
        {
          name: 'freightPrice',
          label: 'V. Unitario',
          align: 'left',
          field: 'freightPrice',
          sortable: true,
          visible: true,
        },
        {
          name: 'netPrice',
          label: 'V. Neto',
          align: 'left',
          field: 'netPrice',
          sortable: true,
          visible: true,
        },
        {
          name: 'settleReceiptWeight',
          label: 'Liq. Cantidad Recibida',
          align: 'center',
          field: 'settleReceiptWeight',
          sortable: true,
          visible: true,
        },
      ],
      optionConveyorCompany: [],
      filter: {
        startDate: null,
        finalDate: null,
        conveyorCompany: null,
      },
      data: [],
      retention: '1',
      observation: '',
      arrayTickets: [],
      thirdSettled: null,
      startDateSettled: null,
      finalDateSettled: null,
      filterRules: {
        startDate: [
          (val) => (!!val) || 'La fecha de inicio es requerida',
        ],
        finalDate: [
          (val) => (!!val) || 'La fecha final es requerida',
        ],
        conveyorCompany: [
          (val) => (!!val) || 'La empresa transportadora es requerida',
        ],
      },
    };
  },
  props: [
    'showNotificationsRef',
    'listFreightSettlementsMountedRef',
  ],
  watch: {
    thirds() {
      this.optionConveyorCompany = this.thirds.filter((third) => (third.active === 1 && third.contractor === 1));
    },
  },
  computed: {
    ...mapState(freightSettlementTypes.PATH, [
      'status',
      'responseMessages',
      'ticketsToSettle',
      'settlementToPrint',
      'settlement',
    ]),
    ...mapState(thirdTypes.PATH, {
      thirds: 'thirds',
      thirdStatus: 'status',
      thirdResponseMessages: 'responseMessages',
    }),
    disableInputs() {
      return this.modal.type === 'D';
    },
    subtotalWeight() {
      let total = 0;
      let valueToCalculate;
      this.data.forEach((element) => {
        valueToCalculate = element.settleReceiptWeight ? element.auxNetWeight.toString().replaceAll(',', '') : element.netWeight.toString().replaceAll(',', '');
        total += parseFloat(valueToCalculate);
      });
      return formatDecimal(total);
    },
    totalValue() {
      let total = 0;
      this.data.forEach((element) => {
        total += parseFloat(element.netPrice.toString().replaceAll(',', ''));
      });
      return formatDecimal(total);
    },
    retentionSubtotal() {
      const total = (parseFloat(this.totalValue.toString().replaceAll(',', '')) / 100) * parseFloat(this.retention.toString().replaceAll(',', ''));
      return formatDecimal(total);
    },
    totalSettle() {
      const total = parseFloat(this.totalValue.toString().replaceAll(',', '')) - parseFloat(this.retentionSubtotal.toString().replaceAll(',', ''));
      return formatDecimal(total);
    },
  },
  methods: {
    ...mapActions(freightSettlementTypes.PATH, {
      getTicketsToSettle: freightSettlementTypes.actions.GET_TICKETS_TO_SETTLE,
      settleTickets: freightSettlementTypes.actions.SETTLE_TICKETS,
      generatePrintDocument: freightSettlementTypes.actions.GENERATE_PRINT_DOCUMENT,
      updateSettlement: freightSettlementTypes.actions.UPDATE_FREIGHT_SETTLEMENT,
      /* deleteZone: materialSettlementTypes.actions.DELETE_ZONE, */
    }),
    ...mapActions(thirdTypes.PATH, {
      listThirds: thirdTypes.actions.LIST_THIRDS,
    }),
    async onFilterSubmit() {
      this.data = [];
      showLoading('Consultando tiquetes ...', 'Por favor, espere', true);
      const data = {
        startDate: formatDateToSave(this.filter.startDate),
        finalDate: formatDateToSave(this.filter.finalDate),
        third: this.filter.conveyorCompany,
      };
      await this.getTicketsToSettle(data);
      if (this.status === true) {
        this.thirdSettled = this.filter.conveyorCompany;
        this.startDateSettled = formatDateToSave(this.filter.startDate);
        this.finalDateSettled = formatDateToSave(this.filter.finalDate);
        this.data = this.ticketsToSettle.map((item) => ({
          ...item,
          roundTrip: item.roundTrip === 1,
          originalAuxNetWeight: item.auxNetWeight,
          settleReceiptWeight: false,
        }));
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      }
      this.$q.loading.hide();
    },
    async showModal(type) {
      this.actionType = type;
      this.id = null;
      if (type === 'S') {
        this.title = 'Liquidar Fletes';
        this.id = null;
        this.filter.type = 'C';
        this.filter.startDate = null;
        this.filter.finalDate = null;
        this.filter.conveyorCompany = null;
        this.filter.material = null;
        this.filter.materialType = null;
        this.showFilter = true;
        this.data = [];
        this.retention = '1';
        this.observation = '';
        this.arrayTickets = [];
        this.modal.show = true;
        this.$q.loading.hide();
      } else if (type === 'U') {
        this.id = this.settlement.id;
        this.title = `Modificar Liquidación: ${this.settlement.consecutive}`;
        this.data = this.ticketsToSettle.map((item) => ({
          ...item,
          settleReceiptWeight: item.settleReceiptWeight === 1,
          roundTrip: item.roundTrip === 1,
        }));
        this.observation = this.settlement.observation;
        this.retention = this.settlement.retention;
        this.startDateSettled = this.settlement.startDateSettled;
        this.finalDateSettled = this.settlement.finalDateSettled;
        this.thirdSettled = this.settlement.thirdSettled;
        this.modal.show = true;
        this.$q.loading.hide();
      }
    },
    async settle() {
      showLoading('Generando la liquidación ...', 'Por favor, espere', true);
      this.arrayTickets = [];
      this.data.forEach((element) => {
        const objectTiquets = {
          id: element.id,
          netValue: parseFloat(element.netPrice.toString().replaceAll(',', '')),
          settleReceiptWeight: element.settleReceiptWeight === true ? 1 : 0,
          weightSettled: (element.settleReceiptWeight === true ? element.auxNetWeight : element.netWeight).toString().replaceAll(',', ''),
          unitValue: parseFloat(element.freightPrice.toString().replaceAll(',', '')),
        };
        this.arrayTickets.push(objectTiquets);
      });
      const data = {
        id: this.id,
        tickets: [...this.arrayTickets],
        type: 'F',
        retentionPercentage: parseFloat(this.retention.toString().replaceAll(',', '')),
        retention: parseFloat(this.retentionSubtotal.toString().replaceAll(',', '')),
        settledSubtotal: parseFloat(this.totalValue.toString().replaceAll(',', '')),
        weightSubtotal: parseFloat(this.subtotalWeight.toString().replaceAll(',', '')),
        totalSettled: parseFloat(this.totalSettle.toString().replaceAll(',', '')),
        third: this.thirdSettled,
        startDate: this.startDateSettled,
        finalDate: this.finalDateSettled,
        observation: this.observation,
      };
      if (this.actionType === 'S') {
        await this.settleTickets(data);
      } else {
        await this.updateSettlement(data);
      }
      if (this.status === true) {
        this.listFreightSettlementsMountedRef();
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.generatePrintDocument(this.settlementToPrint);
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      }
      this.$q.loading.hide();
    },
    async getConveyorCompanies() {
      this.filter.conveyorCompany = null;
      this.optionConveyorCompany = [];
      if (this.filter.startDate !== null && this.filter.startDate !== '' && this.filter.finalDate !== null && this.filter.finalDate !== '') {
        await this.listThirds({
          displayAll: 0,
          type: '%20',
          third: '0',
          origin: 'FS',
          startDate: formatDateToSave(this.filter.startDate),
          finalDate: formatDateToSave(this.filter.finalDate),
        });
        if (this.thirdStatus === false) {
          this.showNotificationsRef(this.thirdResponseMessages, this.thirdStatus, 'top-right', 5000);
        }
      }
    },
    filterConveyorCompany(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionConveyorCompany = this.thirds.filter((option) => (removeAccents(option.name).toLowerCase().indexOf(needle) > -1 && option.active === 1 && option.contractor === 1));
      });
    },
    formatAuxNetWeight(index, blur) {
      this.data[index].auxNetWeight = formatDecimal(this.data[index].auxNetWeight, blur);
    },
    formatFreightPrice(index, blur) {
      this.data[index].freightPrice = formatDecimal(this.data[index].freightPrice, blur);
    },
    formatRetention() {
      this.retention = formatDecimal(this.retention);
    },
    resetAuxReceiptWeight(type, index) {
      this.data[index].auxNetWeight = type === 'T' ? this.data[index].originalAuxNetWeight : 0;
    },
    recalculateValues(index) {
      const settleCheck = this.data[index].settleReceiptWeight;
      const valueToCalculate = settleCheck === true ? parseFloat(this.data[index].auxNetWeight.toString().replaceAll(',', '')) : parseFloat(this.data[index].netWeight.toString().replaceAll(',', ''));
      const freightPrice = parseFloat(this.data[index].freightPrice.toString().replaceAll(',', ''));
      const newValue = valueToCalculate * freightPrice;
      this.data[index].netPrice = formatDecimal(newValue);
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
