<template>
  <div class="q-pa-md">
    <q-dialog v-model="modal.show" persistent>
      <q-card style="width: 95vw; max-width: 95vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6"> {{ title }} QWERTY</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 85vh" class="scroll">
          <div class="row" v-if="actionType === 'S'">
            <q-toggle size="md" v-model="showFilter" checked-icon="visibility" color="green" label="Ver filtro"
              unchecked-icon="visibility_off" />
          </div>
          <q-slide-transition v-if="actionType === 'S'">
            <div v-show="showFilter">
              <q-form @submit="onFilterSubmit" class="q-gutter-md">
                <div class="row">
                  <div class="col col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pr-md-xs">
                    <q-select outlined label="Tipo" v-model="filter.type" :options="types" hide-bottom-space lazy-rules
                      :rules="filterRules.type" map-options emit-value />
                  </div>
                  <div
                    class="col col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pr-md-xs q-pl-md-xs q-pt-sm-xs q-pt-xs-xs q-pt-md-none">
                    <q-input outlined label="Fecha Inicio" :disable="disableInputs" v-model="filter.startDate"
                      lazy-rules :rules="filterRules.startDate" hide-bottom-space clearable mask="##/##/####"
                      @click="$refs.qStartDateProxy.show()">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qStartDateProxy" cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="filter.startDate" mask="DD/MM/YYYY"
                              :options="date => filter.finalDate ? date <= filter.finalDate.split('/').reverse().join('/') : true"
                              @input="$refs.qStartDateProxy.hide()">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Cerrar" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div
                    class="col col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pl-md-xs q-pt-sm-xs q-pt-xs-xs q-pt-md-none">
                    <q-input outlined label="Fecha Fin" :disable="disableInputs" v-model="filter.finalDate" lazy-rules
                      :rules="filterRules.finalDate" hide-bottom-space clearable mask="##/##/####"
                      @click="$refs.qFinalDateProxy.show()">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qFinalDateProxy" cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="filter.finalDate" mask="DD/MM/YYYY"
                              :options="date => filter.startDate ? date >= filter.startDate.split('/').reverse().join('/') : true"
                              @input="$refs.qStartDateProxy.hide()">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Cerrar" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
                <div class="row q-mt-xs">
                  <div class="col col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pr-md-xs">
                    <q-select v-if="filter.type === 'C'" outlined v-model="filter.supplier" use-input clearable
                      input-debounce="0" label="Proveedor" :disable="disableInputs" :options="optionSupplier"
                      option-label="name" option-value="id" reactive-rules :rules="filterRules.supplier"
                      @filter="filterSupplier" hide-bottom-space map-options emit-value>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No hay coincidencias
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                    <q-select v-if="filter.type === 'V'" outlined v-model="filter.customer" use-input clearable
                      input-debounce="0" label="Cliente" :disable="disableInputs" :options="optionCustomer"
                      option-label="name" option-value="id" reactive-rules :rules="filterRules.customer"
                      @filter="filterCustomer" hide-bottom-space map-options emit-value>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No hay coincidencias
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div
                    class="col col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pr-md-xs q-pl-md-xs q-pt-sm-xs q-pt-xs-xs q-pt-md-none">
                    <q-select outlined v-model="filter.material" use-input clearable input-debounce="0" label="Material"
                      :disable="disableInputs" :options="optionMaterial" option-label="name" option-value="id"
                      reactive-rules :rules="filterRules.material" @filter="filterMaterial" hide-bottom-space
                      map-options emit-value @input="resetMaterialInputs('MA')">
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No hay coincidencias
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div
                    class="col col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pl-md-xs q-pt-sm-xs q-pt-xs-xs q-pt-md-none vertical-middle">
                    <div>
                      <span class="label text-grey-7">Medición: </span>
                      <q-radio @input="resetMaterialInputs('MT')" class="q-mt-none" v-model="filter.materialType"
                        val="T" label="Tonelada" reactive-rules :rules="filterRules.materialType" hide-bottom-space />
                      <q-radio @input="resetMaterialInputs('MT')" class="q-mt-none" v-model="filter.materialType"
                        val="U" label="Viaje" reactive-rules :rules="filterRules.materialType" hide-bottom-space />
                    </div>
                  </div>
                </div>
                <div class="row text-center">
                  <q-btn label="Buscar" type="submit" color="primary" class="col q-ml-sm" />
                </div>
              </q-form>
              <q-separator class="q-mt-sm" />
            </div>
          </q-slide-transition>
          <q-table :grid="$q.screen.lt.md" :data="data" :columns="columns" class="q-mt-md" wrap-cells
            :rows-per-page-options="[0]" :hide-pagination="true">
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="typeName" :props="props">
                  {{ props.row.typeName }}
                </q-td>
                <q-td key="date" :props="props">
                  {{ props.row.date }}
                </q-td>
                <q-td key="referralNumber" :props="props">
                  {{ props.row.referralNumber }}
                </q-td>
                <q-td key="receiptNumber" :props="props">
                  {{ props.row.receiptNumber }}
                </q-td>
                <q-td key="material" :props="props">
                  {{ props.row.material }}
                </q-td>
                <q-td key="originYard" :props="props">
                  {{ props.row.originYard }}
                </q-td>
                <q-td key="destinyYard" :props="props">
                  {{ props.row.destinyYard }}
                </q-td>
                <q-td key="netWeight" :props="props">
                  {{ props.row.netWeight }}
                </q-td>
                <q-td key="auxNetWeight" :props="props">
                  <q-input v-if="props.row.materialUnit === 'T'" v-model.trim="props.row.auxNetWeight"
                    :disable="!props.row.settleReceiptWeight" outlined dense
                    @input="formatAuxNetWeight(props.pageIndex, false), recalculateValues(props.pageIndex, settleReceiptWeight)"
                    @blur="formatAuxNetWeight(props.pageIndex, true)" />
                </q-td>
                <q-td key="materialPrice" :props="props">
                  <q-input v-model.trim="props.row.materialPrice" outlined dense
                    @input="formatMaterialPrice(props.pageIndex, false), recalculateValues(props.pageIndex, settleReceiptWeight)"
                    @blur="formatMaterialPrice(props.pageIndex, true)" />
                </q-td>
                <q-td key="netPrice" :props="props">
                  {{ props.row.netPrice }}
                </q-td>
                <q-td key="settleReceiptWeight" :props="props">
                  <q-checkbox v-if="props.row.materialUnit !== 'U'" v-model.trim="props.row.settleReceiptWeight"
                    outlined dense @input="props.row.auxNetWeight = 0" />
                </q-td>
              </q-tr>
            </template>
            <template v-slot:bottom-row v-if="data && data.length > 0">
              <q-tr>
                <q-td class="text-right text-bold" colspan="7">
                  SUBTOTAL
                </q-td>
                <q-td key="subtotalWeight" colspan="1">
                  {{ subtotalWeight }}
                </q-td>
                <q-td colspan="2" />
                <q-td key="totalValue" colspan="1">
                  {{ totalValue }}
                </q-td>
                <q-td colspan="1" />
              </q-tr>
              <q-tr>
                <q-td class="text-right text-bold" colspan="7">
                  RETENCION EN LA FUENTE
                </q-td>
                <q-td class="text-right text-bold" colspan="1">
                  <q-input v-model.trim="retention" outlined dense @input="formatRetention()"
                    @blur="formatRetention()" />
                </q-td>
                <q-td colspan="2" />
                <q-td key="retentionSubtotal" colspan="2">
                  {{ retentionSubtotal }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td class="text-right text-bold" colspan="7">
                  REGALIAS
                </q-td>
                <q-td class="text-right text-bold" colspan="1">
                  <q-input v-model.trim="royalties" outlined dense @input="formatRoyalties()"
                    @blur="formatRoyalties()" />
                </q-td>
                <q-td colspan="2" />
                <q-td key="royaltiesSubtotal" colspan="2">
                  {{ royaltiesSubtotal }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td class="text-right text-bold" colspan="7">
                  TOTAL
                </q-td>
                <q-td colspan="3" />
                <q-td key="totalSettle" colspan="2">
                  {{ totalSettle }}
                </q-td>
              </q-tr>
              <q-tr>
                <q-td class="text-right text-bold" colspan="7">
                  OBSERVACION
                </q-td>
                <q-td class="text-right text-bold" colspan="3">
                  <q-input class="q-mt-xs" :input-style="{ resize: 'none' }" type="textarea" v-model.trim="observation"
                    outlined :disable="disableInputs" hide-bottom-space rows="3" counter maxlength="600" />
                </q-td>
                <q-td class="text-center text-bold" colspan="2">
                  <q-btn label="Liquidar" color="primary" @click="settle" />
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
import materialTypes from '../../store/modules/material/types';
import materialSettlementTypes from '../../store/modules/materialSettlement/types';
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
          name: 'materialPrice',
          label: 'V. Unitario',
          align: 'left',
          field: 'materialPrice',
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
      types: [
        {
          value: 'C',
          label: 'Compra',
        },
        {
          value: 'V',
          label: 'Venta',
        },
      ],
      optionCustomer: [],
      optionSupplier: [],
      optionMaterial: [],
      filter: {
        type: 'C',
        startDate: null,
        finalDate: null,
        supplier: null,
        customer: null,
        material: null,
        materialType: null,
      },
      data: [],
      retention: '2.5',
      royalties: '0',
      observation: '',
      arrayTickets: [],
      thirdSettled: null,
      startDateSettled: null,
      finalDateSettled: null,
      filterRules: {
        type: [
          (val) => (!!val) || 'El tipo es requerido',
        ],
        startDate: [
          (val) => (!!val) || 'La fecha de inicio es requerida',
        ],
        finalDate: [
          (val) => (!!val) || 'La fecha final es requerida',
        ],
        supplier: [
          (val) => (!!val) || 'El proveedor es requerido',
        ],
        customer: [
          (val) => (!!val) || 'El cliente es requerido',
        ],
        materialType: [
          (val) => (this.filter.material !== null || (!!val)) || 'Debe seleccionar un tipo de medición o un material',
        ],
        material: [
          (val) => (this.filter.materialType !== null || (!!val)) || 'Debe seleccionar un tipo de medición o un material',
        ],
      },
    };
  },
  props: [
    'showNotificationsRef',
    'listMaterialSettlementsMountedRef',
  ],
  watch: {
    thirds() {
      this.optionCustomer = this.thirds.filter((third) => (third.active === 1 && third.customer === 1));
      this.optionSupplier = this.thirds.filter((third) => (third.active === 1 && third.associated === 1));
    },
    materials() {
      this.optionMaterial = this.materials.filter((material) => material.active === 1);
    },
  },
  computed: {
    ...mapState(materialSettlementTypes.PATH, [
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
    ...mapState(materialTypes.PATH, {
      materials: 'materials',
      materialStatus: 'status',
      materialResponseMessages: 'responseMessages',
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
    royaltiesSubtotal() {
      const total = parseFloat(this.subtotalWeight.toString().replaceAll(',', '')) * parseFloat(this.royalties.toString().replaceAll(',', ''));
      return formatDecimal(total);
    },
    totalSettle() {
      const total = parseFloat(this.totalValue.toString().replaceAll(',', '')) - parseFloat(this.retentionSubtotal.toString().replaceAll(',', '')) - parseFloat(this.royaltiesSubtotal.toString().replace(/,/g, ''));
      return formatDecimal(total);
    },
  },
  methods: {
    ...mapActions(materialSettlementTypes.PATH, {
      getTicketsToSettle: materialSettlementTypes.actions.GET_TICKETS_TO_SETTLE,
      settleTickets: materialSettlementTypes.actions.SETTLE_TICKETS,
      generatePrintDocument: materialSettlementTypes.actions.GENERATE_PRINT_DOCUMENT,
      updateSettlement: materialSettlementTypes.actions.UPDATE_MATERIAL_SETTLEMENT,
      /* deleteZone: materialSettlementTypes.actions.DELETE_ZONE, */
    }),
    ...mapActions(thirdTypes.PATH, {
      listThirds: thirdTypes.actions.LIST_THIRDS,
    }),
    ...mapActions(materialTypes.PATH, {
      listMaterials: materialTypes.actions.LIST_MATERIALS,
    }),
    async onFilterSubmit() {
      this.data = [];
      showLoading('Consultando tiquetes ...', 'Por favor, espere', true);
      const data = {
        type: this.filter.type,
        startDate: formatDateToSave(this.filter.startDate),
        finalDate: formatDateToSave(this.filter.finalDate),
        third: this.filter.type === 'C' ? this.filter.supplier : this.filter.customer,
        material: this.filter.material === null ? 0 : this.filter.material,
        materialType: this.filter.materialType === null ? 0 : this.filter.materialType,
      };
      await this.getTicketsToSettle(data);
      if (this.status === true) {
        this.thirdSettled = this.filter.type === 'C' ? this.filter.supplier : this.filter.customer;
        this.startDateSettled = formatDateToSave(this.filter.startDate);
        this.finalDateSettled = formatDateToSave(this.filter.finalDate);
        this.data = this.ticketsToSettle.map((item) => ({ ...item, settleReceiptWeight: false }));
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      }
      this.$q.loading.hide();
    },
    async showModal(type) {
      this.actionType = type;
      this.id = null;
      if (type === 'S') {
        this.title = 'Liquidar Materiales';
        await Promise.all([
          this.listThirds({
            displayAll: 0,
            type: '%20',
            third: 0,
            origin: '%20',
            startDate: '%20',
            finalDate: '%20',
          }),
          this.listMaterials({ displayAll: 0, id: 0 }),
        ]);
        if (this.thirdStatus === true && this.materialStatus === true) {
          this.filter.type = 'C';
          this.filter.startDate = null;
          this.filter.finalDate = null;
          this.filter.supplier = null;
          this.filter.customer = null;
          this.filter.material = null;
          this.filter.materialType = null;
          this.showFilter = true;
          this.data = [];
          this.retention = '2.5';
          this.observation = '';
          this.royalties = '0';
          this.arrayTickets = [];
          this.modal.show = true;
        } else {
          if (this.thirdStatus === false) {
            this.showNotificationsRef(this.thirdResponseMessages, this.thirdStatus, 'top-right', 5000);
          }
          if (this.materialStatus === false) {
            this.showNotificationsRef(this.materialResponseMessages, this.materialStatus, 'top-right', 5000);
          }
        }
        this.$q.loading.hide();
      } else if (type === 'U') {
        this.id = this.settlement.id;
        this.title = `Modificar Liquidación: ${this.settlement.consecutive}`;
        this.data = this.ticketsToSettle.map((item) => ({ ...item, settleReceiptWeight: item.settleReceiptWeight === 1 }));
        this.observation = this.settlement.observation;
        this.retention = this.settlement.retention;
        this.royalties = this.settlement.royalties;
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
          weightSettled: (element.settleReceiptWeight ? element.auxNetWeight : element.netWeight).replaceAll(',', ''),
          unitValue: parseFloat(element.materialPrice.toString().replaceAll(',', '')),
        };
        this.arrayTickets.push(objectTiquets);
      });
      const data = {
        id: this.id,
        tickets: this.arrayTickets,
        type: 'M',
        Victor: 'VICTOR',
        retentionPercentage: parseFloat(this.retention.toString().replaceAll(',', '')),
        retention: parseFloat(this.retentionSubtotal.toString().replaceAll(',', '')),
        royalties: parseFloat(this.royaltiesSubtotal.toString().replaceAll(',', '')),
        baseRoyalties: parseFloat(this.royalties.toString().replaceAll(',', '')),
        settledSubtotal: parseFloat(this.totalValue.toString().replaceAll(',', '')),
        weightSubtotal: parseFloat(this.subtotalWeight.toString().replaceAll(',', '')),
        totalSettled: parseFloat(this.totalSettle.toString().replaceAll(',', '')),
        third: this.thirdSettled,
        startDate: this.startDateSettled,
        finalDate: this.finalDateSettled,
        observation: this.observation,
      };
      console.log('OJO', data);
      if (this.actionType === 'S') {
        await this.settleTickets(data);
      } else {
        await this.updateSettlement(data);
      }
      if (this.status === true) {
        this.listMaterialSettlementsMountedRef();
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
    filterSupplier(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionSupplier = this.thirds.filter((option) => (removeAccents(option.name).toLowerCase().indexOf(needle) > -1 && option.active === 1 && option.associated === 1));
      });
    },
    filterCustomer(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionCustomer = this.thirds.filter((option) => (removeAccents(option.name).toLowerCase().indexOf(needle) > -1 && option.active === 1 && option.customer === 1));
      });
    },
    filterMaterial(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionMaterial = this.materials.filter((option) => (removeAccents(option.name).toLowerCase().indexOf(needle) > -1 && option.active === 1));
      });
    },
    formatAuxNetWeight(index, blur) {
      this.data[index].auxNetWeight = formatDecimal(this.data[index].auxNetWeight, blur);
      console.log('OJOAUXWEIGTH', this.data[index].auxNetWeight);
    },
    formatMaterialPrice(index, blur) {
      this.data[index].materialPrice = formatDecimal(this.data[index].materialPrice, blur);
      console.log('OJOMATERIALPRICE', this.data[index].materialPrice);
    },
    formatRetention() {
      this.retention = formatDecimal(this.retention);
    },
    formatRoyalties() {
      this.royalties = formatDecimal(this.royalties);
    },
    resetMaterialInputs(type) {
      if (type === 'MA') {
        this.filter.materialType = null;
      } else {
        this.filter.material = null;
      }
    },
    recalculateValues(index, type) {
      console.log('OJO', index, type);
      let valueToCalculate = parseFloat(this.data[index].auxNetWeight.toString().replaceAll(',', ''));
      if (valueToCalculate === 0) {
        valueToCalculate = parseFloat(this.data[index].netWeight.toString().replaceAll(',', ''));
      }
      const materialPrice = parseFloat(this.data[index].materialPrice.toString().replaceAll(',', ''));
      const newValue = valueToCalculate * materialPrice;
      this.data[index].netPrice = formatDecimal(newValue);
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
