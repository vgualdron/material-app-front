<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="modal.show"
      persistent
    >
      <q-card style="width: 95vw; max-width: 95vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Generar Movimientos</div>
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
          <div class="row">
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
            <div v-show="showFilter">
              <q-form
                @submit="onFilterSubmit"
                class="q-gutter-md"
              >
                <div class="row">
                  <div
                    class="col col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12 q-pr-md-xs"
                  >
                    <q-input
                      outlined
                      label="Fecha Inicio"
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
                  </div>
                  <div
                    class="col col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12 q-pl-md-xs q-pt-sm-xs q-pt-xs-xs q-pt-md-none"
                  >
                    <q-input
                      outlined
                      label="Fecha Fin"
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
                              @input="$refs.qFinalDateProxy.hide()"
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
          />
          <div
            class="row text-center"
          >
            <q-btn
              v-if="data.length > 0"
              label="Generar"
              color="primary"
              class="col q-ml-sm q-mt-sm"
              @click="generate"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import movementTypes from '../../store/modules/movement/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { formatDateToSave } from '../../helpers/formatDateToSave';

export default {
  data() {
    return {
      modal: {
        show: false,
        title: '',
        type: '',
      },
      isLoading: false,
      showFilter: true,
      startDateGenerated: null,
      finalDateGenerated: null,
      columns: [
        {
          name: 'PREFIJO',
          label: 'PREFIJO',
          align: 'left',
          field: 'PREFIJO',
          sortable: true,
          visible: true,
        },
        {
          name: 'CCOSTO',
          label: 'CCOSTO',
          align: 'left',
          field: 'CCOSTO',
          sortable: true,
          visible: true,
        },
        {
          name: 'NUMERO',
          label: 'NUMERO',
          align: 'left',
          field: 'NUMERO',
          sortable: true,
          visible: true,
        },
        {
          name: 'FECHA',
          label: 'FECHA',
          align: 'left',
          field: 'FECHA',
          sortable: true,
          visible: true,
        },
        {
          name: 'ORIGEN',
          label: 'ORIGEN',
          align: 'left',
          field: 'ORIGEN',
          sortable: true,
          visible: true,
        },
        {
          name: 'DESTINO',
          label: 'DESTINO',
          align: 'left',
          field: 'DESTINO',
          sortable: true,
          visible: true,
        },
        {
          name: 'PLACA',
          label: 'PLACA',
          align: 'left',
          field: 'PLACA',
          sortable: true,
          visible: true,
        },
        {
          name: 'ART1',
          label: 'ART1',
          align: 'left',
          field: 'ART1',
          sortable: true,
          visible: true,
        },
        {
          name: 'BODEGA',
          label: 'BODEGA',
          align: 'left',
          field: 'BODEGA',
          sortable: true,
          visible: true,
        },
        {
          name: 'ART2',
          label: 'ART2',
          align: 'left',
          field: 'ART2',
          sortable: true,
          visible: true,
        },
        {
          name: 'BODEGA2',
          label: 'BODEGA2',
          align: 'left',
          field: 'BODEGA2',
          sortable: true,
          visible: true,
        },
        {
          name: 'BRUTO',
          label: 'BRUTO',
          align: 'left',
          field: 'BRUTO',
          sortable: true,
          visible: true,
        },
        {
          name: 'TARA',
          label: 'TARA',
          align: 'left',
          field: 'TARA',
          sortable: true,
          visible: true,
        },
        {
          name: 'NETO',
          label: 'NETO',
          align: 'left',
          field: 'NETO',
          sortable: true,
          visible: true,
        },
        {
          name: 'TARIFAC',
          label: 'TARIFAC',
          align: 'left',
          field: 'TARIFAC',
          sortable: true,
          visible: true,
        },
        {
          name: 'NITTRANS',
          label: 'NITTRANS',
          align: 'left',
          field: 'NITTRANS',
          sortable: true,
          visible: true,
        },
      ],
      filter: {
        startDate: null,
        finalDate: null,
      },
      data: [],
      filterRules: {
        startDate: [
          (val) => (!!val) || 'La fecha de inicio es requerida',
        ],
        finalDate: [
          (val) => (!!val) || 'La fecha final es requerida',
        ],
      },
    };
  },
  props: [
    'showNotificationsRef',
    'listMovementsMountedRef',
    'printRef',
  ],
  watch: {
  },
  computed: {
    ...mapState(movementTypes.PATH, [
      'status',
      'responseMessages',
      'ticketsToGenerate',
      'generatedMovementData',
      'movementsToPrint',
    ]),
  },
  methods: {
    ...mapActions(movementTypes.PATH, {
      getTicketsToGenerate: movementTypes.actions.GET_TICKETS_TO_GENERATE,
      generateMovements: movementTypes.actions.GENERATE_MOVEMENTS,
      /* settleTickets: movementTypes.actions.SETTLE_TICKETS,
      generatePrintDocument: movementTypes.actions.GENERATE_PRINT_DOCUMENT, */
    }),
    async showModal() {
      this.filter.startDate = '';
      this.filter.finalDate = '';
      this.data = [];
      this.modal.show = true;
    },
    async onFilterSubmit() {
      this.data = [];
      showLoading('Consultando tiquetes ...', 'Por favor, espere', true);
      const data = {
        startDate: formatDateToSave(this.filter.startDate),
        finalDate: formatDateToSave(this.filter.finalDate),
      };
      await this.getTicketsToGenerate(data);
      if (this.status === true) {
        this.startDateGenerated = formatDateToSave(this.filter.startDate);
        this.finalDateGenerated = formatDateToSave(this.filter.finalDate);
        this.data = this.ticketsToGenerate.map((item) => ({
          ...item,
        }));
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      }
      this.$q.loading.hide();
    },
    async generate() {
      showLoading('Generando movimientos ...', 'Por favor, espere', true);
      let tickets = this.data.map((element) => element.TICKET);
      tickets = tickets.join(',');
      const data = {
        startDate: this.startDateGenerated,
        finalDate: this.finalDateGenerated,
        tickets,
      };
      await this.generateMovements(data);
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        const { id, consecutive } = this.generatedMovementData;
        this.printRef(id, consecutive);
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      }
      this.$q.loading.hide();
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
