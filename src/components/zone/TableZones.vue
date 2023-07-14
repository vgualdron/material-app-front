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
          placeholder="Buscar zona"
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
          label="Agregar"
          @click="showForm(null, 'C')"
          :disabled="!validatedPermissions.create.status"
          :title="validatedPermissions.create.title"
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
              color="primary"
              field="edit"
              icon="edit"
              :disabled="!validatedPermissions.edit.status"
              :title="validatedPermissions.edit.title"
              @click="showForm(props.row.id, 'E')"
            />
            <q-btn
              class="q-ml-xs"
              color="red"
              field="delete"
              icon="delete"
              :disabled="!validatedPermissions.delete.status"
              :title="validatedPermissions.delete.title"
              @click="showForm(props.row.id, 'D')"
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
                      icon="edit"
                      size="xs"
                      color="primary"
                      :disabled="!validatedPermissions.edit.status"
                      :title="validatedPermissions.edit.title"
                      @click="showForm(props.row.id, 'E')"
                    ></q-btn>
                  </div>
                  <div class="q-mt-xs">
                    <q-btn
                      round
                      icon="delete"
                      size="xs"
                      color="red"
                      :disabled="!validatedPermissions.delete.status"
                      :title="validatedPermissions.delete.title"
                      @click="showForm(props.row.id, 'D')"
                    ></q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
           </q-card>
        </div>
      </template>
    </q-table>
    <form-zones
      ref="formZoneReference"
      :showNotificationsRef="showNotification"
      :listZonesMountedRef="listZonesMounted"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import FormZones from 'components/zone/FormZones.vue';
import zoneTypes from '../../store/modules/zone/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      route: '/zone',
      name: 'Zonas',
      columns: [
        {
          name: 'code',
          label: 'Código',
          align: 'left',
          field: 'code',
          sortable: true,
          visible: true,
        },
        {
          name: 'name',
          align: 'left',
          label: 'Nombre',
          field: 'name',
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
    ...mapState(zoneTypes.PATH, [
      'zones',
      'responseMessages',
      'status',
      'zone',
    ]),
    validatedPermissions() {
      const statusCreate = havePermission('zone.create');
      const statusEdit = havePermission('zone.update');
      const statusDelete = havePermission('zone.delete');
      return {
        create: {
          title: statusCreate ? 'Registrar zona' : 'No tiene permisos para registrar zonas',
          status: statusCreate,
        },
        edit: {
          title: statusEdit ? 'Editar zona' : 'No tiene permisos para editar zonas',
          status: statusEdit,
        },
        delete: {
          title: statusDelete ? 'Eliminar zona' : 'No tiene permisos para eliminar zonas',
          status: statusDelete,
        },
      };
    },
  },
  methods: {
    ...mapActions(zoneTypes.PATH, {
      listZones: zoneTypes.actions.LIST_ZONES,
      getZone: zoneTypes.actions.GET_ZONE,
    }),
    async listZonesMounted() {
      showLoading('Cargando Zonas ...', 'Por favor, espere', true);
      await this.listZones();
      if (this.status === true) {
        this.data = this.zones.map((element) => ({
          ...element,
          showEdit: true,
          showDelete: true,
        }));
        this.$q.loading.hide();
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.data = [];
        this.$q.loading.hide();
      }
    },
    async showForm(id, type) {
      if (id === null) {
        this.$refs.formZoneReference.showModal(id, null, type);
      } else {
        await this.getZone(id);
        if (this.status === true) {
          this.$refs.formZoneReference.showModal(id, { ...this.zone }, type);
        } else {
          this.showNotification(this.responseMessages, 'red', 'top-right', 5000);
        }
      }
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    validateLogin() {
      if (localStorage.getItem('tokenMC')) {
        this.listZonesMounted();
      } else {
        this.$router.push('/');
      }
    },
  },
  components: {
    FormZones,
  },
};
</script>
