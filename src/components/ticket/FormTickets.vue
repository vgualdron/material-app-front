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
                  v-model.trim="ticket.type"
                  :options="types"
                  hide-bottom-space
                  lazy-rules
                  :rules="rules.type"
                  map-options
                  emit-value
                  @input="resetOnTypeChange()"
                />
              </div>
              <div
                class="col col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12 q-pt-md-none q-pt-lg-none q-pt-xl-none q-pt-sm-xs q-pt-xs-xs q-pl-md-xs q-pl-lg-xs q-pl-xl-xs"
              >
                <q-input
                  outlined
                  :disable="disableInputs"
                  v-model="ticket.dateTime"
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
                          v-model="ticket.dateTime"
                          mask="DD/MM/YYYY HH:mm"
                          @input="$refs.qDateProxy.hide()"
                        >
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Cerrar" color="primary" flat></q-btn>
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
                          v-model="ticket.dateTime"
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
                  v-model.trim="ticket.referralNumber"
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
                  v-model.trim="ticket.receiptNumber"
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
                  v-model="ticket.originYard"
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
                  v-model="ticket.destinyYard"
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
                  class="upperInput"
                  v-model.trim="ticket.licensePlate"
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
                  class="upperInput"
                  v-model.trim="ticket.trailerNumber"
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
                  v-model="ticket.customer"
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
                  v-model="ticket.supplier"
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
                  v-model="ticket.conveyorCompany"
                  use-input
                  clearable
                  input-debounce="0"
                  :label="`Empresa Transportadora ${ticket.type === 'D' || ticket.type === 'R' ? '*' : ''}`"
                  :disable="disableInputs"
                  :options="optionConveyorCompany"
                  option-label="name"
                  option-value="id"
                  @filter="filterConveyorCompany"
                  reactive-rules
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
                  class="upperInput"
                  v-model.trim="ticket.driverName"
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
                  class="upperInput"
                  v-model.trim="ticket.driverDocument"
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
                  v-model="ticket.material"
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
                  v-model.trim="ticket.ashPercentage"
                  label="Porcentaje Ceniza *"
                  outlined
                  lazy-rules
                  :rules="rules.ashPercentage"
                  :disable="disableInputs"
                  hide-bottom-space
                  @input="formatAshPercentage(false)"
                  @blur="formatAshPercentage(true)"
                />
              </div>
            </div>

            <div class="row q-pt-none q-mt-xs">
              <div
                class="col col-sm-12 col-xs-12 col-md-4 col-lg-4 col-xl-4 q-pr-md-xs q-pr-lg-xs q-pr-xl-xs"
              >
                <q-input
                  v-model.trim="ticket.grossWeight"
                  label="Peso Bruto Toneladas *"
                  outlined
                  lazy-rules
                  :rules="rules.grossWeight"
                  :disable="disableInputs"
                  hide-bottom-space
                  @input="formatGrossWeight(false)"
                  @blur="formatGrossWeight(true), calculateNetWeight()"
                />
              </div>
              <div
                class="col col-sm-12 col-xs-12 col-md-4 col-lg-4 col-xl-4 q-pl-md-xs q-pl-lg-xs q-pl-xl-xs q-pr-md-xs q-pr-lg-xs q-pr-xl-xs q-mt-sm-xs q-mt-xs-xs q-mt-md-none q-mt-lg-none q-mt-xl-none"
              >
                <q-input
                  v-model.trim="ticket.tareWeight"
                  label="Peso Tara Toneladas *"
                  outlined
                  lazy-rules
                  :rules="rules.tareWeight"
                  :disable="disableInputs"
                  hide-bottom-space
                  @input="formatTareWeight(false)"
                  @blur="formatTareWeight(true), calculateNetWeight()"
                />
              </div>
              <div
                class="col col-sm-12 col-xs-12 col-md-4 col-lg-4 col-xl-4 q-pl-md-xs q-pl-lg-xs q-pl-xl-xs q-mt-sm-xs q-mt-xs-xs q-mt-md-none q-mt-lg-none q-mt-xl-none"
              >
                <q-input
                  v-model.trim="ticket.netWeight"
                  label="Peso Neto Toneladas *"
                  outlined
                  lazy-rules
                  :rules="rules.netWeight"
                  :disable="true"
                  hide-bottom-space
                />
              </div>
            </div>

            <q-select
              class="q-pt-none q-mt-xs upperInput"
              outlined
              v-model.trim="ticket.seals"
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
              class="q-mt-xs upperInput"
              :input-style="{resize: 'none'}"
              type="textarea"
              v-model.trim="ticket.observation"
              label="Observación"
              outlined
              :disable="disableInputs"
              hide-bottom-space
              :rules="rules.observation"
              rows="5"
              counter
              maxlength="600"
            />

            <q-checkbox
              class="q-mt-xs"
              v-if="displayRoundTrip === true"
              left-label
              v-model="ticket.roundTrip"
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
import ticketTypes from '../../store/modules/ticket/types';
import yardTypes from '../../store/modules/yard/types';
import thirdTypes from '../../store/modules/third/types';
import materialTypes from '../../store/modules/material/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { validateDate } from '../../helpers/validateDate';
import { validateTime } from '../../helpers/validateTime';
import { removeAccents } from '../../helpers/removeAccents';
import { formatDecimal } from '../../helpers/formatDecimal';
import { getDateTime } from '../../helpers/getDateTime';
import { formatDateToSave } from '../../helpers/formatDateToSave';

export default {
  name: 'FormTickets',
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
      ticket: {
        id: null,
        user: null,
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
        value: 0,
        grossWeight: 0,
        tareWeight: 0,
        netWeight: 0,
        seals: [],
        observation: '',
        roundTrip: false,
      },
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
        referralNumber: [
          (val) => (!!val) || 'El número de remisión es requerido',
          (val) => (val.length <= 30) || 'El número de remisión debe tener un máximo de 30 caracteres',
        ],
        receiptNumber: [
          (val) => (!!val) || 'El número de recepción es requerido',
          (val) => (val.length <= 30) || 'El número de remisión debe tener un máximo de 50 caracteres',
        ],
        originYard: [
          (val) => (!!val) || 'El patio de despacho es requerido',
        ],
        destinyYard: [
          (val) => (!!val) || 'El número de recepción es requerido',
        ],
        customer: [
          (val) => (!!val) || 'El cliente es requerido',
        ],
        supplier: [
          (val) => (!!val) || 'El proveedor es requerido',
        ],
        conveyorCompany: [
          (val) => (this.ticket.type === 'C' || this.ticket.type === 'V' || (!!val)) || 'La empresa transportadora es requerida',
        ],
        driverName: [
          (val) => (!!val) || 'El nombre del conductor es requerido',
          (val) => (val.length <= 100) || 'El nombre del conductor debe tener un máximo de 100 caracteres',
        ],
        driverDocument: [
          (val) => (!!val) || 'El número de documento del conductor es requerido',
          (val) => (val.length <= 100) || 'El número de documento del conductor debe tener un máximo de 20 caracteres',
        ],
        material: [
          (val) => (!!val) || 'El material es requerido',
        ],
        ashPercentage: [
          (val) => (parseFloat((val || '0').replaceAll(',', '')) <= 100) || 'El porcentaje de cenizas debe ser menor o igual a 100',
        ],
        ashValue: [
          (val) => (parseFloat((val || '0').replaceAll(',', '')) > 0) || 'El Valor del Material debe ser mayor a 0',
        ],
        grossWeight: [
          (val) => (!!val) || 'El peso bruto es requerido',
          (val) => (parseFloat((val || '0').replaceAll(',', '')) < 100000000) || 'El peso bruto debe ser menor a 100,000,000',
          (val) => (parseFloat((val || '0').replaceAll(',', '')) > 0) || 'El peso bruto debe ser mayor a cero',
          (val) => (parseFloat((val || '0').replaceAll(',', '')) > parseFloat((this.ticket.tareWeight || '0').replaceAll(',', ''))) || 'El peso bruto no debe ser menor al peso tara',
        ],
        tareWeight: [
          (val) => (!!val) || 'El peso bruto es requerido',
          (val) => (parseFloat((val || '0').replaceAll(',', '')) < 100000000) || 'El peso tara debe ser menor a 100,000,000',
          (val) => (parseFloat((val || '0').replaceAll(',', '')) > 0) || 'El peso bruto tara ser mayor a cero',
          (val) => (parseFloat((val || '0').replaceAll(',', '')) < parseFloat((this.ticket.grossWeight || '0').replaceAll(',', ''))) || 'El peso tara no debe ser mayor al peso bruto',
        ],
        netWeight: [
          (val) => (!!val) || 'El peso neto es requerido',
          (val) => (parseFloat((val || '0').replaceAll(',', '')) < 100000000) || 'El peso neto debe ser menor a 100,000,000',
          (val) => (parseFloat((val || '0').replaceAll(',', '')) > 0) || 'El peso bruto neto ser mayor a cero',
        ],
        seals: [
          (val) => (JSON.stringify(val || []).length <= 500) || 'Los precintos no deben exceder los 500 caracteres',
        ],
        observation: [
          (val) => (val.length <= 600) || 'La observación debe tener máximo 600 caracteres',
        ],
      },
    };
  },
  mounted() {},
  props: [
    'showNotificationsRef',
    'listTicketsMountedRef',
  ],
  watch: {
    watchYards() {
      this.optionOriginYards = this.yards.filter((yard) => ((yard.active === 1 || yard.id === this.ticket.originYard) && yard.id !== this.ticket.destinyYard));
      this.optionDestinyYards = this.yards.filter((yard) => ((yard.active === 1 || yard.id === this.ticket.destinyYard) && yard.id !== this.ticket.originYard));
    },
    watchThirds() {
      this.optionCustomer = this.thirds.filter((third) => ((third.active === 1 && third.customer === 1) || third.id === this.ticket.customer));
      this.optionSupplier = this.thirds.filter((third) => ((third.active === 1 && third.associated === 1) || third.id === this.ticket.supplier));
      this.optionConveyorCompany = this.thirds.filter((third) => ((third.active === 1 && third.contractor === 1) || third.id === this.ticket.conveyorCompany));
    },
    materials() {
      this.optionMaterial = this.materials.filter((material) => material.active === 1 || material.id === this.ticket.material);
    },
  },
  computed: {
    ...mapState(ticketTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    ...mapState(yardTypes.PATH, {
      yards: 'yards',
      yardStatus: 'status',
      yardResponseMessages: 'responseMessages',
    }),
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
    watchYards() {
      return [
        this.ticket.originYard,
        this.ticket.destinyYard,
        this.yards,
      ];
    },
    watchThirds() {
      return [
        this.ticket.supplier,
        this.ticket.customer,
        this.ticket.conveyorCompany,
        this.thirds,
      ];
    },
    watchMaterials() {
      return [
        this.ticket.material,
        this.materials,
      ];
    },
    disableInputs() {
      return this.modal.type === 'D';
    },
    displayReceiptNumber() {
      return this.ticket.type === 'C' || this.ticket.type === 'R';
    },
    displayOriginYard() {
      return this.ticket.type === 'D' || this.ticket.type === 'R' || this.ticket.type === 'V';
    },
    displayDestinyYard() {
      return this.ticket.type === 'D' || this.ticket.type === 'R' || this.ticket.type === 'C';
    },
    displayValue() {
      return this.ticket.type === 'C' || this.ticket.type === 'V';
    },
    displaySupplier() {
      return this.ticket.type === 'C';
    },
    displayCustomer() {
      return this.ticket.type === 'V';
    },
    displayRoundTrip() {
      return this.ticket.type === 'D' || this.ticket.type === 'R';
    },
  },
  methods: {
    ...mapActions(ticketTypes.PATH, {
      saveTicket: ticketTypes.actions.SAVE_TICKET,
      updateTicket: ticketTypes.actions.UPDATE_TICKET,
      deleteTicket: ticketTypes.actions.DELETE_TICKET,
    }),
    ...mapActions(yardTypes.PATH, {
      listYards: yardTypes.actions.LIST_YARDS,
    }),
    ...mapActions(thirdTypes.PATH, {
      listThirds: thirdTypes.actions.LIST_THIRDS,
    }),
    ...mapActions(materialTypes.PATH, {
      listMaterials: materialTypes.actions.LIST_MATERIALS,
    }),
    async onSubmit() {
      if (this.modal.type === 'C') {
        const ticketToSave = await this.setValuesToSave(null);
        showLoading('Guardando Tiquete ...', 'Por favor, espere', true);
        await this.saveTicket(ticketToSave);
        this.$q.loading.hide();
      } else if (this.modal.type === 'E') {
        const ticketToSave = await this.setValuesToSave(this.ticket.id);
        showLoading('Actualizando Tiquete ...', 'Por favor, espere', true);
        await this.updateTicket(ticketToSave);
      } else if (this.modal.type === 'D') {
        showLoading('Eliminando Tiquete ...', 'Por favor, espere', true);
        await this.deleteTicket(this.ticket.id);
      }
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
        this.resetForm();
        this.listTicketsMountedRef();
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }
    },
    async showModal(id, ticket, type) {
      await Promise.all([
        this.listYards({ id: (id !== null ? ticket.originYard : 0), displayAll: 0 }),
        this.listThirds({
          displayAll: 0,
          type: '%20',
          third: `${id !== null ? ticket.supplier : '0'},${id !== null ? ticket.customer : '0'},${id !== null ? ticket.conveyorCompany : '0'}`,
          origin: '%20',
          startDate: '%20',
          finalDate: '%20',
        }),
        this.listMaterials({ displayAll: 0, id: (id !== null ? ticket.material : 0) }),
      ]);
      if (this.thirdStatus === true && this.materialStatus === true && this.yardStatus === true) {
        if (id !== null) {
          this.ticket.id = id;
          this.ticket.type = ticket.type;
          this.ticket.originYard = ticket.originYard;
          this.ticket.destinyYard = ticket.destinyYard;
          this.ticket.supplier = ticket.supplier;
          this.ticket.customer = ticket.customer;
          this.ticket.material = ticket.material;
          this.ticket.ashPercentage = formatDecimal(ticket.ashPercentage, true);
          this.ticket.ashValue = formatDecimal(ticket.ashValue, true);
          this.ticket.referralNumber = ticket.referralNumber;
          this.ticket.receiptNumber = ticket.receiptNumber;
          this.ticket.dateTime = ticket.dateTime;
          this.ticket.licensePlate = ticket.licensePlate;
          this.ticket.trailerNumber = ticket.trailerNumber;
          this.ticket.driverDocument = ticket.driverDocument;
          this.ticket.driverName = ticket.driverName;
          this.ticket.grossWeight = formatDecimal(ticket.grossWeight, true);
          this.ticket.tareWeight = formatDecimal(ticket.tareWeight, true);
          this.ticket.netWeight = formatDecimal(ticket.netWeight, true);
          this.ticket.conveyorCompany = ticket.conveyorCompany;
          this.ticket.observation = ticket.observation;
          this.ticket.seals = JSON.parse(ticket.seals || '[]');
          this.ticket.roundTrip = ticket.roundTrip === 1;
        } else {
          this.resetForm();
        }
        this.modal.title = type === 'C' ? 'Agregar Tiquete' : (type === 'E' ? 'Editar Tiquete' : 'Eliminar Tiquete');
        this.modal.type = type;
        this.modal.show = true;
        this.$q.loading.hide();
      } else {
        this.$q.loading.hide();
        if (this.thirdStatus === false) {
          this.showNotificationsRef(this.thirdResponseMessages, this.thirdStatus, 'top-right', 5000);
        }
        if (this.materialStatus === false) {
          this.showNotificationsRef(this.materialResponseMessages, this.materialStatus, 'top-right', 5000);
        }
        if (this.yardStatus === false) {
          this.showNotificationsRef(this.yardResponseMessages, this.yardStatus, 'top-right', 5000);
        }
      }
    },
    filterOriginYard(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionOriginYards = this.yards.filter((yard) => (((yard.active === 1 || yard.id === this.ticket.originYard) && yard.id !== this.ticket.destinyYard) && removeAccents(yard.name).toLowerCase().indexOf(needle) > -1));
      });
    },
    filterDestinyYard(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionDestinyYards = this.yards.filter((yard) => (((yard.active === 1 || yard.id === this.ticket.destinyYard) && yard.id !== this.ticket.originYard) && removeAccents(yard.name).toLowerCase().indexOf(needle) > -1));
      });
    },
    filterSupplier(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionSupplier = this.thirds.filter((third) => ((removeAccents(third.name).toLowerCase().indexOf(needle) > -1 && third.active === 1 && third.associated === 1) || third.id === this.ticket.supplier));
      });
    },
    filterCustomer(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionCustomer = this.thirds.filter((third) => ((removeAccents(third.name).toLowerCase().indexOf(needle) > -1 && third.active === 1 && third.customer === 1) || third.id === this.ticket.customer));
      });
    },
    filterMaterial(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionMaterial = this.materials.filter((material) => ((removeAccents(material.name).toLowerCase().indexOf(needle) > -1 && material.active === 1) || material.id === this.ticket.material));
      });
    },
    filterConveyorCompany(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionConveyorCompany = this.thirds.filter((third) => ((removeAccents(third.name).toLowerCase().indexOf(needle) > -1 && third.active === 1 && third.contractor === 1) || third.id === this.ticket.conveyorCompany));
      });
    },
    formatGrossWeight(blur) {
      this.ticket.grossWeight = formatDecimal(this.ticket.grossWeight, blur);
    },
    formatTareWeight(blur) {
      this.ticket.tareWeight = formatDecimal(this.ticket.tareWeight, blur);
    },
    formatAshPercentage(blur) {
      this.ticket.ashPercentage = formatDecimal(this.ticket.ashPercentage, blur);
    },
    formatAshValue(blur) {
      this.ticket.ashVAlue = formatDecimal(this.ticket.ashValue, blur);
    },
    resetOnTypeChange() {
      const userYardData = localStorage.getItem('yardMC') ? localStorage.getItem('yardMC').split('-') : null;
      const userYard = userYardData && typeof userYardData[1] !== 'undefined' && userYardData[1].trim() !== '' ? Number(userYardData[1]) : null;
      this.ticket.originYard = this.ticket.type === 'D' || this.ticket.type === 'V' ? userYard : null;
      this.ticket.destinyYard = this.ticket.type === 'R' || this.ticket.type === 'C' ? userYard : null;
    },
    resetForm() {
      const userYardData = localStorage.getItem('yardMC') ? localStorage.getItem('yardMC').split('-') : null;
      const userYard = userYardData && typeof userYardData[1] !== 'undefined' && userYardData[1].trim() !== '' ? Number(userYardData[1]) : null;
      this.ticket.id = null;
      this.ticket.type = 'D';
      this.ticket.user = null;
      this.ticket.originYard = userYard;
      this.ticket.destinyYard = null;
      this.ticket.supplier = null;
      this.ticket.customer = null;
      this.ticket.material = null;
      this.ticket.ashPercentage = 0;
      this.ticket.ashValue = 0;
      this.ticket.receiptNumber = '';
      this.ticket.referralNumber = '';
      this.ticket.dateTime = `${getDateTime().date} ${getDateTime().time}`;
      this.ticket.licensePlate = '';
      this.ticket.trailerNumber = '';
      this.ticket.driverDocument = '';
      this.ticket.driverName = '';
      this.ticket.grossWeight = 0;
      this.ticket.tareWeight = 0;
      this.ticket.netWeight = 0;
      this.ticket.conveyorCompany = null;
      this.ticket.observation = '';
      this.ticket.seals = [];
      this.ticket.roundTrip = false;
    },
    async setValuesToSave(id) {
      const value = {
        id,
        type: this.ticket.type,
        user: null,
        originYard: this.ticket.type === 'D' || this.ticket.type === 'R' || this.ticket.type === 'V' ? this.ticket.originYard : null,
        destinyYard: this.ticket.type === 'D' || this.ticket.type === 'R' || this.ticket.type === 'C' ? this.ticket.destinyYard : null,
        supplier: this.ticket.type === 'C' ? this.ticket.supplier : null,
        customer: this.ticket.type === 'V' ? this.ticket.customer : null,
        material: this.ticket.material,
        ashPercentage: (this.ticket.ashPercentage || '0').replaceAll(',', ''),
        ashValue: (this.ticket.ashValue || '0').replaceAll(',', ''),
        receiptNumber: this.ticket.type === 'R' || this.ticket.type === 'C' ? this.ticket.receiptNumber.toUpperCase() : null,
        referralNumber: this.ticket.referralNumber.toUpperCase(),
        date: formatDateToSave(this.ticket.dateTime.split(' ')[0]),
        time: this.ticket.dateTime.split(' ')[1],
        licensePlate: this.ticket.licensePlate.toUpperCase(),
        trailerNumber: this.ticket.trailerNumber ? this.ticket.trailerNumber.toUpperCase() : null,
        driverDocument: this.ticket.driverDocument.toUpperCase(),
        driverName: this.ticket.driverName.toUpperCase(),
        grossWeight: (this.ticket.grossWeight || '0').replaceAll(',', ''),
        tareWeight: (this.ticket.tareWeight || '0').replaceAll(',', ''),
        netWeight: (this.ticket.netWeight || '0').replaceAll(',', ''),
        conveyorCompany: this.ticket.conveyorCompany,
        observation: this.ticket.observation.toUpperCase(),
        seals: JSON.stringify((this.ticket.seals || []).map((element) => element.toUpperCase())),
        roundTrip: this.ticket.roundTrip === true ? 1 : 0,
      };
      return value;
    },
    calculateNetWeight() {
      const grossWeight = this.ticket.grossWeight === null || this.ticket.grossWeight === '' ? 0 : parseFloat(this.ticket.grossWeight.toString().replace(/,/g, ''));
      const tareWeight = this.ticket.tareWeight === null || this.ticket.tareWeight === '' ? 0 : parseFloat(this.ticket.tareWeight.toString().replace(/,/g, ''));
      this.ticket.netWeight = formatDecimal((grossWeight - tareWeight).toFixed(2), false);
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
<style>
  .upperInput .q-field__native {
    text-transform: uppercase;
  }
  .upperInput .elipsis {
    text-transform: uppercase;
  }
</style>
