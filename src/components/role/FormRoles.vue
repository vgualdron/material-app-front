<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="modal.show"
      persistent
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
              outlined
              v-model.trim="role.name"
              label="Nombre *"
              lazy-rules
              :rules="rules.name"
              :disable="disableInputs || !role.editable"
              hide-bottom-space
            />
            <q-separator />
            <div class="bg-gray-9 q-mt-xs">
              <div class="col q-mr-auto q-ml-auto text-center text-weight-bold">
                <h6 class="q-ma-none"> Permisos </h6>
              </div>
              <q-list
                bordered
                class="rounded-borders"
              >
                <q-expansion-item
                  v-for="(permission, key) in permissions"
                  :key="key"
                  :label="key"
                  class="text-weight-bold "
                  default-opened
                >
                  <q-card>
                    <q-card-section class="text-weight-light q-pt-xs q-pb-xs">
                      <q-option-group
                        :options="permissions[key]"
                        type="checkbox"
                        v-model="role.permissions"
                        :disable="disableInputs || !role.editable"
                      />
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </div>
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
                :disable="!role.editable"
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
import permissionTypes from '../../store/modules/permission/types';
import roleTypes from '../../store/modules/role/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      modal: {
        show: false,
        title: '',
        type: '',
      },
      isLoading: false,
      role: {
        id: null,
        name: '',
        permissions: [],
        editable: true,
      },
      rules: {
        name: [
          (val) => (!!val) || 'El nombre es requerido',
          (val) => (val.length >= 4) || 'El nombre debe tener un mínimo de 4 caracteres',
          (val) => (val.length <= 30) || 'El nombre debe tener un máximo de 30 caracteres',
        ],
      },
    };
  },
  props: [
    'showNotificationsRef',
    'listRolesMountedRef',
  ],
  computed: {
    ...mapState(roleTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    ...mapState(permissionTypes.PATH, {
      permissions: 'permissions',
      permissionStatus: 'status',
      permissionResponseMessages: 'responseMessages',
    }),
    disableInputs() {
      return this.modal.type === 'D';
    },
  },
  methods: {
    ...mapActions(roleTypes.PATH, {
      saveRole: roleTypes.actions.SAVE_ROLE,
      updateRole: roleTypes.actions.UPDATE_ROLE,
      deleteRole: roleTypes.actions.DELETE_ROLE,
    }),
    ...mapActions(permissionTypes.PATH, {
      listPermissions: permissionTypes.actions.LIST_PERMISSIONS,
    }),
    async onSubmit() {
      if (this.modal.type === 'C') {
        showLoading('Guardando Rol ...', 'Por favor, espere', true);
        await this.saveRole(this.role);
      } else if (this.modal.type === 'E') {
        showLoading('Actualizando Rol ...', 'Por favor, espere', true);
        await this.updateRole(this.role);
      } else if (this.modal.type === 'D') {
        showLoading('Eliminando Rol ...', 'Por favor, espere', true);
        await this.deleteRole(this.role.id);
      }
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
        this.role.id = null;
        this.role.name = '';
        this.role.permissions = [];
        this.role.editable = true;
        this.listRolesMountedRef();
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }
    },
    async showModal(id, role, type) {
      await this.listPermissions();
      if (this.permissionStatus === true) {
        this.role.id = id !== null ? id : null;
        this.role.name = id !== null ? role.name : '';
        this.role.permissions = id !== null ? role.permissions : [];
        this.role.editable = id !== null ? role.editable === 1 : true;
        this.modal.title = type === 'C' ? 'Agregar Rol' : (type === 'E' ? 'Editar Rol' : 'Eliminar Rol');
        this.modal.type = type;
        this.$q.loading.hide();
        this.modal.show = true;
      } else {
        this.$q.loading.hide();
        this.showNotificationsRef(this.permissionResponseMessages, this.permissionStatus, 'top-right', 5000);
      }
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
