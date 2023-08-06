<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="modal.show"
      persistent
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Agregar Información</div>
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
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
          >
            <div class="row q-pt-none q-mt-xs">
              <div
                class="col col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12 q-pr-md-xs q-pr-lg-xs q-pr-xl-xs"
              >
                <q-input
                  v-model.trim="settlement.consecutive"
                  label="Consecutivo"
                  outlined
                  :disable="true"
                  hide-bottom-space
                />
              </div>
              <div
                class="col col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12 q-pt-md-none q-pt-lg-none q-pt-xl-none q-pt-sm-xs q-pt-xs-xs q-pl-md-xs q-pl-lg-xs q-pl-xl-xs"
              >
                <q-input
                  outlined
                  v-model.trim="settlement.date"
                  label="Fecha"
                  :disable="true"
                  hide-bottom-space
                />
              </div>
            </div>
            <div class="row q-pt-none q-mt-xs">
              <div
                class="col col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12 q-pr-md-xs q-pr-lg-xs q-pr-xl-xs"
              >
                <q-input
                  class="q-mt-xs"
                  outlined
                  v-model.trim="settlement.third"
                  label="Tercero"
                  :disable="true"
                  hide-bottom-space
                />
              </div>
              <div
                class="col col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12 q-pt-md-none q-pt-lg-none q-pt-xl-none q-pt-sm-xs q-pt-xs-xs q-pl-md-xs q-pl-lg-xs q-pl-xl-xs"
              >
                <q-input
                  class="q-mt-xs"
                  outlined
                  v-model.trim="settlement.totalSettled"
                  label="Total Liquidado"
                  :disable="true"
                  hide-bottom-space
                />
              </div>
            </div>
            <div class="row q-pt-none q-mt-xs">
              <div
                class="col col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12 q-pr-md-xs q-pr-lg-xs q-pr-xl-xs"
              >
                <q-input
                  outlined
                  label="Factura"
                  v-model.trim="settlement.invoice"
                  reactive-rules
                  :rules="rules.invoice"
                  hide-bottom-space
                />
              </div>
              <div
                class="col col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12 q-pt-md-none q-pt-lg-none q-pt-xl-none q-pt-sm-xs q-pt-xs-xs q-pl-md-xs q-pl-lg-xs q-pl-xl-xs"
              >
                <q-input
                  outlined
                  label="Fecha Factura"
                  v-model="settlement.invoiceDate"
                  reactive-rules
                  :rules="rules.invoiceDate"
                  hide-bottom-space
                  mask="##/##/####"
                  clearable
                  @click="$refs.qDateProxy.show()"
                >
                  <template v-slot:append>
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
                          v-model="settlement.invoiceDate"
                          mask="DD/MM/YYYY"
                          @input="$refs.qDateProxy.hide()"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
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
            <q-input
              class="q-mt-xs"
              outlined
              v-model.trim="settlement.internalDocument"
              label="Documento Interno"
              reactive-rules
              :rules="rules.internalDocument"
              hide-bottom-space
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
import freightSettlementTypes from '../../store/modules/freightSettlement/types';
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
      settlement: {
        id: null,
        consecutive: '',
        date: '',
        third: '',
        totalSettled: '',
        invoice: '',
        invoiceDate: null,
        internalDocument: '',
      },
      rules: {
        invoice: [
          (val) => (this.settlement.invoiceDate === '' || (!!val)) || 'Si ingresa una fecha de factura, debe agregar la factura',
          (val) => (val.length <= 50) || 'La factura debe tener un máximo de 50 caracteres',
        ],
        invoiceDate: [
          (val) => (this.settlement.invoice === '' || (!!val)) || 'Si ingresa factura, debe agregar la fecha de la factura',
        ],
        internalDocument: [
          (val) => (val.length <= 50) || 'El documento interno debe tener un máximo de 50 caracteres',
        ],
      },
    };
  },
  props: [
    'showNotificationsRef',
    'listFreightSettlementsMountedRef',
  ],
  computed: {
    ...mapState(freightSettlementTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    disableInputs() {
      return this.modal.type === 'D';
    },
  },
  methods: {
    ...mapActions(freightSettlementTypes.PATH, {
      addInformation: freightSettlementTypes.actions.ADD_SETTLEMENT_INFORMATION,
    }),
    async onSubmit() {
      showLoading('Guardando Información ...', 'Por favor, espere', true);
      const settlement = await this.setValuesToSave();
      await this.addInformation(settlement);
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.settlement.invoice = null;
        this.settlement.invoiceDate = '';
        this.settlement.internalDocument = '';
        this.listFreightSettlementsMountedRef();
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      }
      this.$q.loading.hide();
    },
    showModal(id, settlement) {
      this.settlement.id = id;
      this.settlement.consecutive = settlement.consecutive;
      this.settlement.date = settlement.date;
      this.settlement.third = settlement.third;
      this.settlement.totalSettled = settlement.totalSettled;
      this.settlement.invoice = settlement.invoice === null ? '' : settlement.invoice;
      this.settlement.invoiceDate = settlement.invoiceDate === null ? '' : settlement.invoiceDate;
      this.settlement.internalDocument = settlement.internalDocument === null ? '' : settlement.internalDocument;
      this.modal.show = true;
    },
    async setValuesToSave() {
      const value = {
        id: this.settlement.id,
        invoice: this.settlement.invoice,
        invoiceDate: this.settlement.invoiceDate ? formatDateToSave(this.settlement.invoiceDate) : null,
        internalDocument: this.settlement.internalDocument,
      };
      return value;
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
