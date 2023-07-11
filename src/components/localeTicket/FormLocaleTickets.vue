<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="modal.show"
      persistent
    >
      <q-card style="max-width: 90vw; min-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ modal.title }}</div>
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
          style="max-height: 90vh"
          class="scroll"
        >
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
          >
            <div class="row q-pt-none q-mt-xs">
              <div
                class="col col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12 q-pr-md-xs q-pr-lg-xs q-pr-xl-xs"
              >
                <q-select
                  outlined
                  label="Tipo *"
                  :disable="disableInputs"
                  v-model.trim="localeTicket.type"
                  :options="types"
                  hide-bottom-space
                  lazy-rules
                  :rules="rules.type"
                  map-options
                  emit-value
                />
              </div>
              <div
                class="col col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12 q-pt-md-none q-pt-lg-none q-pt-xl-none q-pt-sm-xs q-pt-xs-xs q-pl-md-xs q-pl-lg-xs q-pl-xl-xs"
              >
                <q-input
                  outlined
                  v-model="localeTicket.dateTime"
                  label="Fecha y hora *"
                  mask="##/##/#### ##:##"
                  hide-bottom-space
                  lazy-rules
                  :rules="rules.dateTime"
                >
                  <template v-slot:prepend>
                    <q-icon
                      name="event"
                      class="cursor-pointer"
                    >
                      <q-popup-proxy
                        ref="qDateProxy"
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="localeTicket.dateTime"
                          mask="DD/MM/YYYY HH:mm"
                          @input="$refs.qDateProxy.hide()"
                        >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                  <template v-slot:append>
                    <q-icon
                      name="access_time"
                      class="cursor-pointer"
                    >
                      <q-popup-proxy
                        ref="qTimeProxy"
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-time
                          v-model="localeTicket.dateTime"
                          mask="DD/MM/YYYY HH:mm"
                          @input="$refs.qTimeProxy.hide()"
                          format24h
                        >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-pt-none q-mt-xs">
              <div
                class="col"
                :class="[displayReceiptNumber === true ? 'col-lg-6 col-md-6 col-sm-12 col-xs-12 q-pr-md-xs q-pr-sm-none q-pr-lg-xs' : 'col-md-12 col-sm-12 col-xs-12']"
              >
                <q-input
                  v-model.trim="localeTicket.referralNumber"
                  label="Número Remisión"
                  outlined
                  lazy-rules
                  :rules="rules.referralNumber"
                  :disable="disableInputs"
                  hide-bottom-space
                  mask="XXXXXXXXXXXXXXXXXXXX"
                />
              </div>
              <div
                v-if="displayReceiptNumber"
                class="col col-lg-6 col-md-6 col-xs-6 col-xl-6 col-md-6 col-sm-12 col-xs-12 q-pt-sm-xs q-pt-xs-xs q-pt-md-none q-pt-lg-none q-pt-xl-none q-pl-md-xs q-pl-lg-xs q-pl-xl-xs"
              >
                <q-input
                  v-model.trim="localeTicket.receiptNumber"
                  label="Número Recibo"
                  outlined
                  lazy-rules
                  :rules="rules.receiptNumber"
                  :disable="disableInputs"
                  hide-bottom-space
                  mask="XXXXXXXXXXXXXXXXXXXX"
                />
              </div>
            </div>
            <div class="row q-pt-none q-mt-xs">
              <div
                v-if="displayOriginYard"
                class="col"
                :class="displayDestinyYard === true ? 'col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12 q-pr-md-xs': 'col-12'"
              >
                <q-select
                  outlined
                  v-model="localeTicket.originYard"
                  use-input
                  clearable
                  input-debounce="0"
                  label="Patio Despacho *"
                  :disable="disableInputs"
                  :options="optionOriginYards"
                  option-label="name"
                  option-value="id"
                  @filter="filterOriginYard"
                  lazy-rules
                  :rules="rules.originYard"
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
              <div
                v-if="displayDestinyYard"
                class="col"
                :class="displayOriginYard === true ? 'col-md-6 col-lg-6 col-xl-6  col-sm-12 col-xs-12 q-pl-md-xs q-mt-sm-xs q-mt-xs-xs q-mt-md-none q-mt-lg-none q-mt-xl-none': 'col-12'"
              >
                <q-select
                  outlined
                  v-model="localeTicket.destinyYard"
                  use-input
                  clearable
                  input-debounce="0"
                  label="Patio Recepción *"
                  :disable="disableInputs"
                  :options="optionDestinyYards"
                  option-label="name"
                  option-value="id"
                  @filter="filterDestinyYard"
                  lazy-rules
                  :rules="rules.destinyYard"
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
            <div class="row q-pt-none q-mt-xs">
              <div
                class="col col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12 q-pr-md-xs q-pr-lg-xs q-pr-xl-xs"
              >
                <q-input
                  v-model.trim="localeTicket.licensePlate"
                  label="Placa vehículo"
                  outlined
                  lazy-rules
                  :rules="rules.licensePlate"
                  :disable="disableInputs"
                  hide-bottom-space
                  mask="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                />
              </div>
              <div
                class="col col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12 q-pt-md-none q-pt-lg-none q-pt-xl-none q-pt-sm-xs q-pt-xs-xs q-pl-md-xs q-pl-lg-xs q-pl-xl-xs"
              >
                <q-input
                  v-model.trim="localeTicket.trailerNumber"
                  label="Número Trailer"
                  outlined
                  lazy-rules
                  :rules="rules.trailerNumber"
                  :disable="disableInputs"
                  hide-bottom-space
                  mask="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                />
              </div>
            </div>
            <div class="row q-pt-none q-mt-xs">
              <div
                v-if="displayCustomer === true"
                class="col col-sm-12 col-xs-12 col-md-6 col-lg-6 col-xl-6 q-pr-md-xs q-pr-lg-xs q-pr-xl-xs"
              >
                <q-select
                  outlined
                  v-model="localeTicket.customer"
                  use-input
                  clearable
                  input-debounce="0"
                  label="Cliente *"
                  :disable="disableInputs"
                  :options="optionCustomer"
                  option-label="name"
                  option-value="id"
                  @filter="filterCustomer"
                  lazy-rules
                  :rules="rules.customer"
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
              <div
                v-if="displaySupplier === true"
                class="col col-sm-12 col-xs-12 col-md-6 col-lg-6 col-xl-6 q-pr-md-xs q-pr-lg-xs q-pr-xl-xs"
              >
                <q-select
                  outlined
                  v-model="localeTicket.supplier"
                  use-input
                  clearable
                  input-debounce="0"
                  label="Proveedor *"
                  :disable="disableInputs"
                  :options="optionSupplier"
                  option-label="name"
                  option-value="id"
                  @filter="filterSupplier"
                  lazy-rules
                  :rules="rules.supplier"
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
              <div
                class="col"
                :class="displaySupplier === true || displayCustomer === true ? 'col-md-6 col-lg-6 col-xl-6  col-sm-12 col-xs-12 q-pl-md-xs q-mt-sm-xs q-mt-xs-xs q-mt-md-none q-mt-lg-none q-mt-xl-none': 'col-12'"
              >
                <q-select
                  outlined
                  v-model="localeTicket.conveyorCompany"
                  use-input
                  clearable
                  input-debounce="0"
                  label="Empresa Transportadora *"
                  :disable="disableInputs"
                  :options="optionConveyorCompany"
                  option-label="name"
                  option-value="id"
                  @filter="filterConveyorCompany"
                  lazy-rules
                  :rules="rules.conveyorCompany"
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

            <div class="row q-pt-none q-mt-xs">
              <div
                class="col col-sm-12 col-xs-12 col-md-6 col-lg-6 col-xl-6 q-pr-md-xs q-pr-lg-xs q-pr-xl-xs"
              >
                <q-input
                  v-model.trim="localeTicket.driverName"
                  label="Nombre Conductor *"
                  outlined
                  lazy-rules
                  :rules="rules.driverName"
                  :disable="disableInputs"
                  hide-bottom-space
                />
              </div>
              <div
                class="col col-sm-12 col-xs-12 col-md-6 col-lg-6 col-xl-6 q-pl-md-xs q-pl-lg-xs q-pl-xl-xs q-mt-sm-xs q-mt-xs-xs q-mt-md-none q-mt-lg-none q-mt-xl-none"
              >
                <q-input
                  v-model.trim="localeTicket.driverDocument"
                  label="Documento Conductor *"
                  outlined
                  lazy-rules
                  :rules="rules.driverDocument"
                  :disable="disableInputs"
                  hide-bottom-space
                />
              </div>
            </div>

            <div class="row q-pt-none q-mt-xs">
              <div
                class="col col-sm-12 col-xs-12 col-md-8 col-lg-8 col-xl-8 q-pr-md-xs q-pr-lg-xs q-pr-xl-xs"
              >
                <q-select
                  outlined
                  v-model="localeTicket.material"
                  use-input
                  clearable
                  input-debounce="0"
                  label="Material *"
                  :disable="disableInputs"
                  :options="optionMaterial"
                  option-label="name"
                  option-value="id"
                  lazy-rules
                  :rules="rules.material"
                  @filter="filterMaterial"
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
              <div
                class="col col-sm-12 col-xs-12 col-md-4 col-lg-4 col-xl-4 q-pl-md-xs q-pl-lg-xs q-pl-xl-xs q-mt-sm-xs q-mt-xs-xs q-mt-md-none q-mt-lg-none q-mt-xl-none"
              >
                <q-input
                  v-model.trim="localeTicket.ashPercentage"
                  label="Porcentaje Ceniza *"
                  outlined
                  lazy-rules
                  :rules="rules.driverDocument"
                  :disable="disableInputs"
                  hide-bottom-space
                />
              </div>
            </div>

            <div class="row q-pt-none q-mt-xs">
              <div
                class="col col-sm-12 col-xs-12 col-md-4 col-lg-4 col-xl-4 q-pr-md-xs q-pr-lg-xs q-pr-xl-xs"
              >
                <q-input
                  v-model.trim="localeTicket.grossWeight"
                  label="Peso Bruto *"
                  outlined
                  lazy-rules
                  :rules="rules.driverDocument"
                  :disable="disableInputs"
                  hide-bottom-space
                />
              </div>
              <div
                class="col col-sm-12 col-xs-12 col-md-4 col-lg-4 col-xl-4 q-pl-md-xs q-pl-lg-xs q-pl-xl-xs q-pr-md-xs q-pr-lg-xs q-pr-xl-xs q-mt-sm-xs q-mt-xs-xs q-mt-md-none q-mt-lg-none q-mt-xl-none"
              >
                <q-input
                  v-model.trim="localeTicket.tareWeight"
                  label="Peso Tara *"
                  outlined
                  lazy-rules
                  :rules="rules.driverDocument"
                  :disable="disableInputs"
                  hide-bottom-space
                />
              </div>
              <div
                class="col col-sm-12 col-xs-12 col-md-4 col-lg-4 col-xl-4 q-pl-md-xs q-pl-lg-xs q-pl-xl-xs q-mt-sm-xs q-mt-xs-xs q-mt-md-none q-mt-lg-none q-mt-xl-none"
              >
                <q-input
                  v-model.trim="localeTicket.netWeight"
                  label="Peso Neto *"
                  outlined
                  lazy-rules
                  :rules="rules.driverDocument"
                  :disable="disableInputs"
                  hide-bottom-space
                />
              </div>
            </div>

            <q-select
              class="q-pt-none q-mt-xs"
              outlined
              v-model.trim="localeTicket.seals"
              label="Precintos"
              multiple
              use-chips
              use-input
              new-value-mode="add"
              stack-label
              hide-dropdown-icon
              :rules="rules.seals"
              :disable="disableInputs"
              hide-bottom-space
            />

            <q-input
              class="q-mt-xs"
              :input-style="{resize: 'none'}"
              type="textarea"
              v-model.trim="localeTicket.observation"
              label="Observación"
              outlined
              :disable="disableInputs"
              hide-bottom-space
              rows="5"
              counter
              maxlength="600"
            />

            <q-checkbox
              class="q-mt-xs"
              v-if="displayRoundTrip === true"
              left-label
              v-model="localeTicket.roundTrip"
              text-h6
              color="green"
              :disable="disableInputs"
              label="Viaje redondo"
            />

            <q-separator />
            <div class="row text-center">
              <q-btn label="cancelar"
                type="reset"
                color="primary"
                outline class="col"
                v-close-popup
                @click="modal.show = false"
              />
              <q-btn
                label="Aceptar"
                type="submit"
                color="primary"
                class="col q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import localeTicketTypes from '../../store/modules/localeTicket/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { validateDate } from '../../helpers/validateDate';
import { validateTime } from '../../helpers/validateTime';
import { removeAccents } from '../../helpers/removeAccents';
import { generateUUID } from '../../helpers/generateUUID';

export default {
  data() {
    return {
      modal: {
        show: false,
        title: '',
        type: '',
      },
      types: [
        { value: 'D', label: 'Despacho' },
        { value: 'R', label: 'Recepción' },
        { value: 'C', label: 'Compra' },
        { value: 'V', label: 'Venta' },
        /* { value: 'OC', text: 'Operación con Cliente' },
        { value: 'OP', text: 'Operación con Proveedor' } */
      ],
      isLoading: false,
      localeTicket: {
        id: null,
        type: 'D',
        dateTime: null,
        licensePlate: '',
        trailerNumber: '',
        referralNumber: '',
        receiptNumber: '',
        originYard: null,
        destinyYard: null,
        supplier: null,
        customer: null,
        conveyorCompany: null,
        driverName: '',
        driverDocument: '',
        material: null,
        ashPercentage: 0,
        grossWeight: 0,
        tareWeight: 0,
        netWeight: 0,
        seals: [],
        observation: '',
        roundTrip: false,
      },
      yards: [],
      thirds: [],
      materials: [],
      optionOriginYards: [],
      optionDestinyYards: [],
      optionCustomer: [],
      optionSupplier: [],
      optionConveyorCompany: [],
      optionMaterial: [],
      rules: {
        type: [
          (val) => (!!val) || 'El tipo es requerido',
        ],
        dateTime: [
          (val) => (!!val) || 'Debe ingresar una fecha y una hora',
          (val) => (val.split(' ')[0] !== undefined && validateDate(val.split(' ')[0])) || 'La fecha ingresada no es válida',
          (val) => (val.split(' ')[1] !== undefined && validateTime(val.split(' ')[1])) || 'La hora ingresada no es válida',
        ],
        licensePlate: [
          (val) => (!!val) || 'El número de placa es requerido',
          (val) => (val.length <= 30) || 'El número de placa debe tener un máximo de 30 caracteres',
        ],
        trailerNumber: [
          (val) => (!val || val.length <= 30) || 'El número de trailer debe tener un máximo de 30 caracteres',
        ],
        receiptNumber: [
          (val) => (!!val) || 'El número de remisión es requerido',
          (val) => (val.length <= 50) || 'El número de remisión debe tener un máximo de 50 caracteres',
        ],
      },
    };
  },
  mounted() {
    console.log(generateUUID());
    this.yards = [
      {
        id: 1,
        code: 'PC',
        name: 'PATIO CÚCUTA',
        active: 1,
      },
      {
        id: 2,
        code: 'PT',
        name: 'PATIO TIBÚ',
        active: 1,
      },
      {
        id: 3,
        code: 'PP',
        name: 'PATIO PAMPLONA',
        active: 1,
      },
    ];
    this.materials = [
      {
        id: 1,
        code: 'CB',
        name: 'COQUE BRUTO',
        unit: 'T',
        active: 1,
      },
      {
        id: 2,
        code: 'C3',
        name: 'CARBON 3 PULGADAS',
        unit: 'T',
        active: 1,
      },
    ];
    this.thirds = [
      {
        id: 1,
        nit: 'NITP1',
        name: 'PROVEEDOR 1',
        active: 1,
        customer: 0,
        associated: 1,
        contractor: 0,
      },
      {
        id: 2,
        nit: 'NITP2',
        name: 'PROVEEDOR 2',
        active: 1,
        customer: 0,
        associated: 1,
        contractor: 0,
      },
      {
        id: 3,
        nit: 'NITC1',
        name: 'CLIENTE 1',
        active: 1,
        customer: 1,
        associated: 0,
        contractor: 0,
      },
      {
        id: 4,
        nit: 'NITC2',
        name: 'CLIENTE 2',
        active: 1,
        customer: 1,
        associated: 0,
        contractor: 0,
      },
      {
        id: 5,
        nit: 'NITT1',
        name: 'TRANSPORTADOR 1',
        active: 1,
        customer: 0,
        associated: 0,
        contractor: 1,
      },
      {
        id: 6,
        nit: 'NITT2',
        name: 'TRANSPORTADOR 2',
        active: 1,
        customer: 0,
        associated: 0,
        contractor: 1,
      },
    ];
  },
  props: [
    'showNotificationsRef',
    'listLocaleTicketsMountedRef',
  ],
  watch: {
    watchYards() {
      this.optionOriginYards = this.yards.filter((yard) => ((yard.active === 1 || yard.id === this.localeTicket.originYard) && yard.id !== this.localeTicket.destinyYard));
      this.optionDestinyYards = this.yards.filter((yard) => ((yard.active === 1 || yard.id === this.localeTicket.destinyYard) && yard.id !== this.localeTicket.originYard));
    },
    watchThirds() {
      this.optionCustomer = this.thirds.filter((third) => ((third.active === 1 && third.customer === 1) || third.id === this.localeTicket.customer));
      this.optionSupplier = this.thirds.filter((third) => ((third.active === 1 && third.associated === 1) || third.id === this.localeTicket.supplier));
      this.optionConveyorCompany = this.thirds.filter((third) => ((third.active === 1 && third.contractor === 1) || third.id === this.localeTicket.conveyorCompany));
    },
    materials() {
      this.optionMaterial = this.materials.filter((material) => material.active === 1 || material.id === this.localeTicket.material);
    },
  },
  computed: {
    ...mapState(localeTicketTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    watchYards() {
      return [
        this.localeTicket.originYard,
        this.localeTicket.destinyYard,
        this.yards,
      ];
    },
    watchThirds() {
      return [
        this.localeTicket.supplier,
        this.localeTicket.customer,
        this.localeTicket.conveyorCompany,
        this.thirds,
      ];
    },
    watchMaterials() {
      return [
        this.localeTicket.material,
        this.materials,
      ];
    },
    disableInputs() {
      return this.modal.type === 'D';
    },
    displayReceiptNumber() {
      return this.localeTicket.type === 'C' || this.localeTicket.type === 'R';
    },
    displayOriginYard() {
      return this.localeTicket.type === 'D' || this.localeTicket.type === 'R' || this.localeTicket.type === 'V';
    },
    displayDestinyYard() {
      return this.localeTicket.type === 'D' || this.localeTicket.type === 'R' || this.localeTicket.type === 'C';
    },
    displaySupplier() {
      return this.localeTicket.type === 'C';
    },
    displayCustomer() {
      return this.localeTicket.type === 'V';
    },
    displayRoundTrip() {
      return this.localeTicket.type === 'D' || this.localeTicket.type === 'R';
    },
  },
  methods: {
    ...mapActions(localeTicketTypes.PATH, {
      saveLocaleTicket: localeTicketTypes.actions.SAVE_LOCALE_TICKET,
      updateLocaleTicket: localeTicketTypes.actions.UPDATE_LOCALE_TICKET,
      deleteLocaleTicket: localeTicketTypes.actions.DELETE_LOCALE_TICKET,
    }),
    async onSubmit() {
      if (this.modal.type === 'C') {
        showLoading('Guardando Tiquete ...', 'Por favor, espere', true);
        await this.saveLocaleTicket(this.localeTicket);
      } else if (this.modal.type === 'E') {
        showLoading('Actualizando Tiquete ...', 'Por favor, espere', true);
        await this.updateLocaleTicket(this.localeTicket);
      } else if (this.modal.type === 'D') {
        showLoading('Eliminando Tiquete ...', 'Por favor, espere', true);
        await this.deleteLocaleTicket(this.localeTicket.id);
      }
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
        /* this.ticket.id = null;
        this.ticket.code = '';
        this.ticket.name = ''; */
        this.listLocaleTicketsMountedRef();
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }
    },
    showModal(id, localeTicket, type) {
      this.localeTicket.id = id !== null ? id : null;
      this.localeTicket.originYard = id !== null ? localeTicket.originYard : null;
      this.localeTicket.destinyYard = id !== null ? localeTicket.destinyYard : null;
      this.localeTicket.name = id !== null ? localeTicket.name : '';
      this.modal.title = type === 'C' ? 'Agregar Tiquete' : (type === 'E' ? 'Editar Tiquete' : 'Eliminar Tiquete');
      this.modal.type = type;
      this.modal.show = true;
    },
    filterOriginYard(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionOriginYards = this.yards.filter((yard) => (((yard.active === 1 || yard.id === this.localeTicket.originYard) && yard.id !== this.localeTicket.destinyYard) && removeAccents(yard.name).toLowerCase().indexOf(needle) > -1));
      });
    },
    filterDestinyYard(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionDestinyYards = this.yards.filter((yard) => (((yard.active === 1 || yard.id === this.localeTicket.destinyYard) && yard.id !== this.localeTicket.originYard) && removeAccents(yard.name).toLowerCase().indexOf(needle) > -1));
      });
    },
    filterSupplier(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionSupplier = this.thirds.filter((third) => ((removeAccents(third.name).toLowerCase().indexOf(needle) > -1 && third.active === 1 && third.associated === 1) || third.id === this.localeTicket.supplier));
      });
    },
    filterCustomer(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionCustomer = this.thirds.filter((third) => ((removeAccents(third.name).toLowerCase().indexOf(needle) > -1 && third.active === 1 && third.customer === 1) || third.id === this.localeTicket.customer));
      });
    },
    filterMaterial(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionMaterial = this.materials.filter((material) => ((removeAccents(material.name).toLowerCase().indexOf(needle) > -1 && material.active === 1) || material.id === this.localeTicket.material));
      });
    },
    filterConveyorCompany(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.tri().toLowerCase()) : '';
        this.optionConveyorCompany = this.thirds.filter((third) => ((removeAccents(third.name).toLowerCase().indexOf(needle) > -1 && third.active === 1 && third.contractor === 1) || third.id === this.localeTicket.conveyorCompany));
      });
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
