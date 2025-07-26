<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="modal.show"
      persistent
      @hide="hideModal"
    >
      <q-card style="width: 500px; max-width: 80vw;">
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
          style="max-height: 60vh"
          class="scroll"
        >
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
          >
            <q-input
              v-model.trim="user.documentNumber"
              label="Número de Documento *"
              outlined
              lazy-rules
              :rules="rules.documentNumber"
              :disable="disableInputs || !user.editable"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model.trim="user.name"
              label="Nombre *"
              lazy-rules
              :rules="rules.name"
              :disable="disableInputs || !user.editable"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model.trim="user.phone"
              label="Teléfono *"
              lazy-rules
              :rules="rules.phone"
              :disable="disableInputs || !user.editable"
              hide-bottom-space
            />
            <q-select
              v-model="user.yard"
              class="q-mt-xs"
              use-input
              clearable
              input-debounce="0"
              label="Patio"
              :disable="disableInputs || !user.editable"
              :options="optionYards"
              option-label="name"
              option-value="id"
              @filter="filterYard"
              lazy-rules
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
            <q-checkbox
              v-if="modal.type==='E'"
              left-label
              v-model="isEditablePassword"
              text-h6
              color="green"
              :disable="disableInputs || !user.editable"
              label="Desea modificar la contraseña?"
            />
            <div class="row" v-if="modal.type==='E' && isEditablePassword">
              <div class="col-12 col-md q-pr-md-xs">
                <q-input
                  type="password"
                  outlined
                  v-model.trim="user.password"
                  label="Contraseña"
                  lazy-rules
                  hide-bottom-space
                  :disable="disableInputs || !user.editable"
                  :rules="rules.password"
                  autocomplete="new-password"
                />
              </div>
              <div class="col-12 col-md q-pt-sm-md q-pt-xs-md q-pt-md-none q-pl -md-xs">
                <q-input
                  type="password"
                  outlined
                  v-model.trim="user.confirmPassword"
                  label="Confirmar contraseña"
                  lazy-rules
                  hide-bottom-space
                  :disable="disableInputs || !user.editable"
                  :rules="rules.confirmPassword"
                />
              </div>
            </div>
            <q-checkbox
              left-label
              v-model="user.active"
              text-h6
              color="green"
              :disable="disableInputs || !user.editable"
              label="El usuario se encuentra activo"
            />
            <q-checkbox
              class="q-mt-none"
              left-label
              v-model="user.changeYard"
              text-h6
              color="green"
              :disable="disableInputs || !user.editable"
              label="Puede cambiar su patio predeterminado en tiquetes"
            />
            <q-checkbox
              class="q-mt-none"
              left-label
              v-model="user.listYards"
              text-h6
              color="green"
              :disable="disableInputs || !user.editable"
              label="Puede listar todos los patios en Produccion"
            />
            <q-separator />
            <div class="bg-gray-9 q-mt-xs">
              <div
                class="col q-mr-auto q-ml-auto text-center text-weight-bold"
              >
                Roles
              </div>
              <q-list
                bordered
                class="rounded-borders"
              >
                <q-card>
                  <q-card-section class="text-weight-light q-pt-xs q-pb-xs">
                    <q-option-group
                      class="text-center"
                      :options="normalizedRoles"
                      type="checkbox"
                      v-model="user.roles"
                      :disable="disableInputs || !user.editable"
                      emit-value
                    />
                  </q-card-section>
                </q-card>
              </q-list>
            </div>
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
import userTypes from '../../store/modules/user/types';
import yardTypes from '../../store/modules/yard/types';
import roleTypes from '../../store/modules/role/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { removeAccents } from '../../helpers/removeAccents';

export default {
  data() {
    return {
      modal: {
        show: false,
        title: '',
        type: '',
      },
      isLoading: false,
      user: {
        id: null,
        documentNumber: '',
        name: '',
        phone: '',
        yard: null,
        active: false,
        password: '',
        confirmPassword: '',
        roles: [],
        changeYard: false,
        listYards: false,
      },
      optionYards: [],
      rules: {
        documentNumber: [
          (val) => (!!val) || 'El número de documento es requerido',
          (val) => (val.length >= 5) || 'El código debe tener un mínimo de 5 caracteres',
          (val) => (val.length <= 15) || 'El código debe tener un máximo de 15 caracteres',
        ],
        name: [
          (val) => (!!val) || 'El nombre es requerido',
          (val) => (val.length >= 5) || 'El nombre debe tener un mínimo de 5 caracteres',
          (val) => (val.length <= 50) || 'El nombre debe tener un máximo de 50 caracteres',
        ],
        phone: [
          (val) => (!!val) || 'El teléfono es requerido',
          (val) => (val.length >= 5) || 'El número de telefono debe tener un mínimo de 5 caracteres',
          (val) => (val.length <= 15) || 'El número de telefono debe tener un máximo de 15 caracteres',
        ],
        password: [
          (val) => (!val || val.length >= 5) || 'La contraseña debe tener un mínimo de 5 caracteres',
          (val) => (!val || val.length <= 20) || 'La contraseña debe tener un máximo de 20 caracteres',
        ],
        confirmPassword: [
          (val) => (val === this.user.password) || 'La confirmación no coincide con la contraseña',
        ],
      },
      isEditablePassword: false,
    };
  },
  props: [
    'showNotificationsRef',
    'listUsersMountedRef',
  ],
  watch: {
    yards(val) {
      this.optionYards = [...val];
    },
    isEditablePassword() {
      this.user.password = '';
      this.user.confirmPassword = '';
    },
  },
  computed: {
    ...mapState(userTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    ...mapState(yardTypes.PATH, {
      yards: 'yards',
      yardStatus: 'status',
      yardResponseMessages: 'responseMessages',
    }),
    ...mapState(roleTypes.PATH, {
      roles: 'roles',
      roleStatus: 'status',
      roleResponseMessages: 'responseMessages',
    }),
    normalizedRoles() {
      return this.roles.map(({
        id: value,
        name: label,
      }) => ({
        value,
        label,
      }));
    },
    disableInputs() {
      return this.modal.type === 'D';
    },
  },
  methods: {
    ...mapActions(userTypes.PATH, {
      saveUser: userTypes.actions.SAVE_USER,
      updateUser: userTypes.actions.UPDATE_USER,
      deleteUser: userTypes.actions.DELETE_USER,
    }),
    ...mapActions(yardTypes.PATH, {
      listYards: yardTypes.actions.LIST_YARDS,
    }),
    ...mapActions(roleTypes.PATH, {
      listRoles: roleTypes.actions.LIST_ROLES,
    }),
    async onSubmit() {
      if (this.modal.type === 'C') {
        showLoading('Guardando Usuario ...', 'Por favor, espere', true);
        await this.saveUser(this.user);
      } else if (this.modal.type === 'E') {
        showLoading('Actualizando Usuario ...', 'Por favor, espere', true);
        await this.updateUser(this.user);
      } else if (this.modal.type === 'D') {
        showLoading('Eliminando Usuario ...', 'Por favor, espere', true);
        await this.deleteUser(this.user.id);
      }
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
        this.user.id = null;
        this.user.documentNumber = '';
        this.user.name = '';
        this.user.phone = '';
        this.user.yard = null;
        this.user.active = true;
        this.user.changeYard = false;
        this.user.listYards = false;
        this.user.password = '';
        this.user.confirmPassword = '';
        this.user.roles = [];
        this.listUsersMountedRef();
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }
    },
    async showModal(id, user, type) {
      await Promise.all([this.listRoles(), this.listYards({ id: (id !== null ? user.yard : 0), displayAll: 0 })]);
      if (this.roleStatus === true && this.yardStatus === true) {
        this.user.id = id !== null ? id : null;
        this.user.documentNumber = id !== null ? user.documentNumber : '';
        this.user.name = id !== null ? user.name : '';
        this.user.phone = id !== null ? user.phone : '';
        this.user.yard = id !== null ? user.yard : null;
        this.user.active = id !== null ? (user.active === 1) : true;
        this.user.editable = id !== null ? (user.editable === 1) : true;
        this.user.changeYard = id !== null ? (user.changeYard === 1) : false;
        this.user.listYards = id !== null ? (user.listYards === 1) : false;
        this.user.password = '';
        this.user.confirmPassword = '';
        this.user.roles = id !== null ? user.roles : [];
        this.modal.title = type === 'C' ? 'Agregar Usuario' : (type === 'E' ? 'Editar Usuario' : 'Eliminar Usuario');
        this.modal.type = type;
        this.modal.show = true;
        this.$q.loading.hide();
      } else {
        this.$q.loading.hide();
        if (this.yardStatus === false) {
          this.showNotificationsRef(this.yardResponseMessages, this.yardStatus, 'top-right', 5000);
        }
        if (this.roleStatus === false) {
          this.showNotificationsRef(this.roleResponseMessages, this.yardStatus, 'top-right', 5000);
        }
      }
    },
    filterYard(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionYards = this.yards.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
      });
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    hideModal() {
      this.isEditablePassword = false;
    },
  },
};
</script>
