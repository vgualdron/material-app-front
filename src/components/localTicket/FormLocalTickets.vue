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
                  v-model.trim="localTicket.type"
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
                  v-model="localTicket.dateTime"
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
                          v-model="localTicket.dateTime"
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
                          v-model="localTicket.dateTime"
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
                  v-model.trim="localTicket.referralNumber"
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
                  v-model.trim="localTicket.receiptNumber"
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
                  v-model="localTicket.originYard"
                  use-input
                  clearable
                  input-debounce="0"
                  label="Patio Despacho *"
                  :disable="disableInputs || disableOriginYard"
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
                  v-model="localTicket.destinyYard"
                  use-input
                  clearable
                  input-debounce="0"
                  label="Patio Recepción *"
                  :disable="disableInputs  || disableDestinyYard"
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
                  v-model.trim="localTicket.licensePlate"
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
                  v-model.trim="localTicket.trailerNumber"
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
                  v-model="localTicket.customer"
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
                  v-model="localTicket.supplier"
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
                  v-model="localTicket.conveyorCompany"
                  use-input
                  clearable
                  input-debounce="0"
                  :label="`Empresa Transportadora ${localTicket.type === 'D' || localTicket.type === 'R' ? '*' : ''}`"
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
                  class="upperInput"
                  v-model.trim="localTicket.driverName"
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
                  v-model.trim="localTicket.driverDocument"
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
                  v-model="localTicket.material"
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
                  v-model.trim="localTicket.ashPercentage"
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
                  v-model.trim="localTicket.grossWeight"
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
                  v-model.trim="localTicket.tareWeight"
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
                  v-model.trim="localTicket.netWeight"
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
              v-model.trim="localTicket.seals"
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
              v-model.trim="localTicket.observation"
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
              v-model="localTicket.roundTrip"
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
import localTicketTypes from '../../store/modules/localTicket/types';
import localDataManagementTypes from '../../store/modules/localDataManagement/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { validateDate } from '../../helpers/validateDate';
import { validateTime } from '../../helpers/validateTime';
import { removeAccents } from '../../helpers/removeAccents';
import { formatDecimal } from '../../helpers/formatDecimal';
import { getDateTime } from '../../helpers/getDateTime';
import { formatDateToSave } from '../../helpers/formatDateToSave';

export default {
  name: 'FormLocalTickets',
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
      localTicket: {
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
        grossWeight: 0,
        tareWeight: 0,
        netWeight: 0,
        seals: [],
        observation: '',
        roundTrip: false,
        localCreatedAt: null,
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
          (val) => (this.localTicket.type === 'C' || this.localTicket.type === 'V' || (!!val)) || 'La empresa transportadora es requerida',
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
        grossWeight: [
          (val) => (!!val) || 'El peso bruto es requerido',
          (val) => (parseFloat((val || '0').replaceAll(',', '')) < 100000000) || 'El peso bruto debe ser menor a 100,000,000',
          (val) => (parseFloat((val || '0').replaceAll(',', '')) > 0) || 'El peso bruto debe ser mayor a cero',
          (val) => (parseFloat((val || '0').replaceAll(',', '')) > parseFloat((this.localTicket.tareWeight || '0').replaceAll(',', ''))) || 'El peso bruto no debe ser menor al peso tara',
        ],
        tareWeight: [
          (val) => (!!val) || 'El peso bruto es requerido',
          (val) => (parseFloat((val || '0').replaceAll(',', '')) < 100000000) || 'El peso tara debe ser menor a 100,000,000',
          (val) => (parseFloat((val || '0').replaceAll(',', '')) > 0) || 'El peso bruto tara ser mayor a cero',
          (val) => (parseFloat((val || '0').replaceAll(',', '')) < parseFloat((this.localTicket.grossWeight || '0').replaceAll(',', ''))) || 'El peso tara no debe ser mayor al peso bruto',
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
    'listLocalTicketsMountedRef',
  ],
  watch: {
    watchYards() {
      this.optionOriginYards = this.yards.filter((yard) => ((yard.active === 1 || yard.id === this.localTicket.originYard) && yard.id !== this.localTicket.destinyYard));
      this.optionDestinyYards = this.yards.filter((yard) => ((yard.active === 1 || yard.id === this.localTicket.destinyYard) && yard.id !== this.localTicket.originYard));
    },
    watchThirds() {
      this.optionCustomer = this.thirds.filter((third) => ((third.active === 1 && third.customer === 1) || third.id === this.localTicket.customer));
      this.optionSupplier = this.thirds.filter((third) => ((third.active === 1 && third.associated === 1) || third.id === this.localTicket.supplier));
      this.optionConveyorCompany = this.thirds.filter((third) => ((third.active === 1 && third.contractor === 1) || third.id === this.localTicket.conveyorCompany));
    },
    materials() {
      this.optionMaterial = this.materials.filter((material) => material.active === 1 || material.id === this.localTicket.material);
    },
  },
  computed: {
    ...mapState(localTicketTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    ...mapState(localDataManagementTypes.PATH, {
      thirds: 'localThirds',
      yards: 'localYards',
      materials: 'localMaterials',
      localDataManagementStatus: 'status',
      thirdStatus: 'thirdStatus',
      materialStatus: 'materialStatus',
      yardStatus: 'yardStatus',
      localDataManagementResponseMessages: 'responseMessages',
      thirdResponseMessages: 'thirdResponseMessages',
      materialResponseMessages: 'materialResponseMessages',
      yardResponseMessages: 'yardResponseMessages',
    }),
    watchYards() {
      return [
        this.localTicket.originYard,
        this.localTicket.destinyYard,
        this.yards,
      ];
    },
    watchThirds() {
      return [
        this.localTicket.supplier,
        this.localTicket.customer,
        this.localTicket.conveyorCompany,
        this.thirds,
      ];
    },
    watchMaterials() {
      return [
        this.localTicket.material,
        this.materials,
      ];
    },
    disableInputs() {
      return this.modal.type === 'D';
    },
    displayReceiptNumber() {
      return this.localTicket.type === 'C' || this.localTicket.type === 'R';
    },
    displayOriginYard() {
      return this.localTicket.type === 'D' || this.localTicket.type === 'R' || this.localTicket.type === 'V';
    },
    displayDestinyYard() {
      return this.localTicket.type === 'D' || this.localTicket.type === 'R' || this.localTicket.type === 'C';
    },
    displaySupplier() {
      return this.localTicket.type === 'C';
    },
    displayCustomer() {
      return this.localTicket.type === 'V';
    },
    displayRoundTrip() {
      return this.localTicket.type === 'D' || this.localTicket.type === 'R';
    },
    disableOriginYard() {
      if (this.localTicket.type === 'D' || this.localTicket.type === 'V') {
        const userYardData = localStorage.getItem('yardMC') ? localStorage.getItem('yardMC').split('-') : 0;// aca el split es para separar el id del nombre
        const changeYard = userYardData && typeof userYardData[0] !== 'undefined' && userYardData[0].trim() !== '' ? Number(userYardData[0]) : 0;
        return changeYard === 0;
      }
      return false;
    },
    disableDestinyYard() {
      if (this.localTicket.type === 'R' || this.localTicket.type === 'C') {
        const userYardData = localStorage.getItem('yardMC') ? localStorage.getItem('yardMC').split('-') : 0;
        const changeYard = userYardData && typeof userYardData[0] !== 'undefined' && userYardData[0].trim() !== '' ? Number(userYardData[0]) : 0;
        return changeYard === 0;
      }
      return false;
    },
  },
  methods: {
    ...mapActions(localTicketTypes.PATH, {
      saveLocalTicket: localTicketTypes.actions.SAVE_LOCAL_TICKET,
      updateLocalTicket: localTicketTypes.actions.UPDATE_LOCAL_TICKET,
      deleteLocalTicket: localTicketTypes.actions.DELETE_LOCAL_TICKET,
    }),
    ...mapActions(localDataManagementTypes.PATH, {
      listThirds: localDataManagementTypes.actions.LIST_LOCAL_THIRDS,
      listMaterials: localDataManagementTypes.actions.LIST_LOCAL_MATERIALS,
      listYards: localDataManagementTypes.actions.LIST_LOCAL_YARDS,
      getData: localDataManagementTypes.actions.GET_DATA,
    }),
    async onSubmit() {
      if (this.modal.type === 'C') {
        const ticketToSave = await this.setValuesToSave(null);
        showLoading('Guardando Tiquete ...', 'Por favor, espere', true);
        await this.saveLocalTicket(ticketToSave);
        this.$q.loading.hide();
      } else if (this.modal.type === 'E') {
        const ticketToSave = await this.setValuesToSave(this.localTicket.id);
        showLoading('Actualizando Tiquete ...', 'Por favor, espere', true);
        await this.updateLocalTicket(ticketToSave);
      } else if (this.modal.type === 'D') {
        showLoading('Eliminando Tiquete ...', 'Por favor, espere', true);
        await this.deleteLocalTicket(this.localTicket.id);
      }
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
        this.resetForm();
        this.listLocalTicketsMountedRef();
        this.getData();
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }
    },
    async showModal(id, localTicket, type) {
      await Promise.all([
        this.listThirds(`${id !== null ? localTicket.supplier : 0},${id !== null ? localTicket.customer : 0},${id !== null ? localTicket.conveyorCompany : 0}`),
        this.listMaterials(id !== null ? localTicket.material : 0),
        this.listYards(`${id !== null ? localTicket.originYard : 0},${id !== null ? localTicket.destinyYard : 0}`),
      ]);
      if (this.thirdStatus === true && this.materialStatus === true && this.yardStatus === true) {
        if (id !== null) {
          this.localTicket.id = id;
          this.localTicket.type = localTicket.type;
          this.localTicket.originYard = localTicket.originYard;
          this.localTicket.destinyYard = localTicket.destinyYard;
          this.localTicket.supplier = localTicket.supplier;
          this.localTicket.customer = localTicket.customer;
          this.localTicket.material = localTicket.material;
          this.localTicket.ashPercentage = formatDecimal(localTicket.ashPercentage, true);
          this.localTicket.referralNumber = localTicket.referralNumber;
          this.localTicket.receiptNumber = localTicket.receiptNumber;
          this.localTicket.dateTime = localTicket.dateTime;
          this.localTicket.licensePlate = localTicket.licensePlate;
          this.localTicket.trailerNumber = localTicket.trailerNumber;
          this.localTicket.driverDocument = localTicket.driverDocument;
          this.localTicket.driverName = localTicket.driverName;
          this.localTicket.grossWeight = formatDecimal(localTicket.grossWeight, true);
          this.localTicket.tareWeight = formatDecimal(localTicket.tareWeight, true);
          this.localTicket.netWeight = formatDecimal(localTicket.netWeight, true);
          this.localTicket.conveyorCompany = localTicket.conveyorCompany;
          this.localTicket.observation = localTicket.observation;
          this.localTicket.seals = JSON.parse(localTicket.seals || '[]');
          this.localTicket.roundTrip = localTicket.roundTrip === 1;
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
        this.optionOriginYards = this.yards.filter((yard) => (((yard.active === 1 || yard.id === this.localTicket.originYard) && yard.id !== this.localTicket.destinyYard) && removeAccents(yard.name).toLowerCase().indexOf(needle) > -1));
      });
    },
    filterDestinyYard(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionDestinyYards = this.yards.filter((yard) => (((yard.active === 1 || yard.id === this.localTicket.destinyYard) && yard.id !== this.localTicket.originYard) && removeAccents(yard.name).toLowerCase().indexOf(needle) > -1));
      });
    },
    filterSupplier(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionSupplier = this.thirds.filter((third) => ((removeAccents(third.name).toLowerCase().indexOf(needle) > -1 && third.active === 1 && third.associated === 1) || third.id === this.localTicket.supplier));
      });
    },
    filterCustomer(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionCustomer = this.thirds.filter((third) => ((removeAccents(third.name).toLowerCase().indexOf(needle) > -1 && third.active === 1 && third.customer === 1) || third.id === this.localTicket.customer));
      });
    },
    filterMaterial(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionMaterial = this.materials.filter((material) => ((removeAccents(material.name).toLowerCase().indexOf(needle) > -1 && material.active === 1) || material.id === this.localTicket.material));
      });
    },
    filterConveyorCompany(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionConveyorCompany = this.thirds.filter((third) => ((removeAccents(third.name).toLowerCase().indexOf(needle) > -1 && third.active === 1 && third.contractor === 1) || third.id === this.localTicket.conveyorCompany));
      });
    },
    formatGrossWeight(blur) {
      this.localTicket.grossWeight = formatDecimal(this.localTicket.grossWeight, blur);
    },
    formatTareWeight(blur) {
      this.localTicket.tareWeight = formatDecimal(this.localTicket.tareWeight, blur);
    },
    formatAshPercentage(blur) {
      this.localTicket.ashPercentage = formatDecimal(this.localTicket.ashPercentage, blur);
    },
    resetOnTypeChange() {
      const userYardData = localStorage.getItem('yardMC') ? localStorage.getItem('yardMC').split('-') : null;
      const userYard = userYardData && typeof userYardData[1] !== 'undefined' && userYardData[1].trim() !== '' ? Number(userYardData[1]) : null;
      this.localTicket.originYard = this.localTicket.type === 'D' || this.localTicket.type === 'V' ? userYard : null;
      this.localTicket.destinyYard = this.localTicket.type === 'R' || this.localTicket.type === 'C' ? userYard : null;
    },
    resetForm() {
      const userYardData = localStorage.getItem('yardMC') ? localStorage.getItem('yardMC').split('-') : null;
      const userYard = userYardData && typeof userYardData[1] !== 'undefined' && userYardData[1].trim() !== '' ? Number(userYardData[1]) : null;
      this.localTicket.id = null;
      this.localTicket.type = 'D';
      this.localTicket.user = null;
      this.localTicket.originYard = userYard;
      this.localTicket.destinyYard = null;
      this.localTicket.supplier = null;
      this.localTicket.customer = null;
      this.localTicket.material = null;
      this.localTicket.ashPercentage = 0;
      this.localTicket.receiptNumber = '';
      this.localTicket.referralNumber = '';
      this.localTicket.dateTime = `${getDateTime().date} ${getDateTime().time}`;
      this.localTicket.licensePlate = '';
      this.localTicket.trailerNumber = '';
      this.localTicket.driverDocument = '';
      this.localTicket.driverName = '';
      this.localTicket.grossWeight = 0;
      this.localTicket.tareWeight = 0;
      this.localTicket.netWeight = 0;
      this.localTicket.conveyorCompany = null;
      this.localTicket.observation = '';
      this.localTicket.seals = [];
      this.localTicket.roundTrip = false;
    },
    async setValuesToSave(id) {
      const value = {
        id,
        type: this.localTicket.type,
        user: Number(localStorage.getItem('userMC')),
        originYard: this.localTicket.type === 'D' || this.localTicket.type === 'R' || this.localTicket.type === 'V' ? this.localTicket.originYard : null,
        destinyYard: this.localTicket.type === 'D' || this.localTicket.type === 'R' || this.localTicket.type === 'C' ? this.localTicket.destinyYard : null,
        supplier: this.localTicket.type === 'C' ? this.localTicket.supplier : null,
        customer: this.localTicket.type === 'V' ? this.localTicket.customer : null,
        material: this.localTicket.material,
        ashPercentage: (this.localTicket.ashPercentage || '0').replaceAll(',', ''),
        receiptNumber: this.localTicket.type === 'R' || this.localTicket.type === 'C' ? this.localTicket.receiptNumber.toUpperCase() : null,
        referralNumber: this.localTicket.referralNumber.toUpperCase(),
        date: formatDateToSave(this.localTicket.dateTime.split(' ')[0]),
        time: this.localTicket.dateTime.split(' ')[1],
        licensePlate: this.localTicket.licensePlate.toUpperCase(),
        trailerNumber: this.localTicket.trailerNumber.toUpperCase(),
        driverDocument: this.localTicket.driverDocument.toUpperCase(),
        driverName: this.localTicket.driverName.toUpperCase(),
        grossWeight: (this.localTicket.grossWeight || '0').replaceAll(',', ''),
        tareWeight: (this.localTicket.tareWeight || '0').replaceAll(',', ''),
        netWeight: (this.localTicket.netWeight || '0').replaceAll(',', ''),
        conveyorCompany: this.localTicket.conveyorCompany,
        observation: this.localTicket.observation,
        seals: JSON.stringify((this.localTicket.seals || []).map((element) => element.toUpperCase())),
        roundTrip: this.localTicket.roundTrip === true ? 1 : 0,
        localCreatedAt: formatDateToSave(getDateTime().date),
      };
      return value;
    },
    calculateNetWeight() {
      const grossWeight = this.localTicket.grossWeight === null || this.localTicket.grossWeight === '' ? 0 : parseFloat(this.localTicket.grossWeight.toString().replace(/,/g, ''));
      const tareWeight = this.localTicket.tareWeight === null || this.localTicket.tareWeight === '' ? 0 : parseFloat(this.localTicket.tareWeight.toString().replace(/,/g, ''));
      this.localTicket.netWeight = formatDecimal((grossWeight - tareWeight).toFixed(2), false);
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
