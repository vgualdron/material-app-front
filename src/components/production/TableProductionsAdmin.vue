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
          placeholder="Buscar Produccion"
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
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
    <form-productions
      ref="formProductionReference"
      :showNotificationsRef="showNotification"
      :listProductionsMountedRef="listProductionsMounted"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import FormProductions from 'components/production/FormProductions.vue';
import productionTypes from '../../store/modules/production/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      route: '/production',
      name: 'Producciones',
      columns: [
        {
          name: 'date',
          label: 'Cargue',
          align: 'left',
          field: 'date',
          sortable: true,
          visible: true,
        },
        {
          name: 'date_download',
          align: 'left',
          label: 'Descargue',
          field: 'date_download',
          sortable: true,
          visible: true,
        },
        {
          name: 'oven_name',
          align: 'left',
          label: 'Horno',
          field: 'oven_name',
          sortable: true,
          visible: true,
        },
        {
          name: 'performance',
          align: 'left',
          label: 'Eficiencia',
          field: 'performance',
          sortable: true,
          visible: true,
        },
        {
          name: 'starting_name',
          align: 'left',
          label: 'Producto Incial',
          field: 'starting_name',
          sortable: true,
          visible: true,
        },
        {
          name: 'finished_name',
          align: 'left',
          label: 'Producto Final',
          field: 'finished_name',
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
    ...mapState(productionTypes.PATH, [
      'productions',
      'responseMessages',
      'status',
      'production',
    ]),
    validatedPermissions() {
      const statusCreate = havePermission('production.create');
      const statusEdit = havePermission('production.update');
      const statusDelete = havePermission('production.delete');
      return {
        create: {
          title: statusCreate ? 'Registrar Produccion' : 'No tiene permisos para registrar producciones',
          status: statusCreate,
        },
        edit: {
          title: statusEdit ? 'Editar Produccion' : 'No tiene permisos para editar producciones',
          status: statusEdit,
        },
        delete: {
          title: statusDelete ? 'Eliminar produccion' : 'No tiene permisos para eliminar producciones',
          status: statusDelete,
        },
      };
    },
  },
  methods: {
    ...mapActions(productionTypes.PATH, {
      listProductions: productionTypes.actions.LIST_PRODUCTIONS,
      getProduction: productionTypes.actions.GET_PRODUCTION,
    }),
    async listProductionsMounted() {
      showLoading('Cargando Producciones ...', 'Por favor, espere', true);
      await this.listProductions();
      if (this.status === true) {
        this.data = this.productions.map((element) => ({
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
      showLoading('Preparando formulario ...', 'Por favor, espere', true);
      if (id === null) {
        this.$refs.formProductionReference.showModal(id, null, type);
      } else {
        await this.getProduction(id);
        if (this.status === true) {
          this.$refs.formProductionReference.showModal(id, { ...this.production }, type);
        } else {
          this.$q.loading.hide();
          this.showNotification(this.responseMessages, 'red', 'top-right', 5000);
        }
      }
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    validateLogin() {
      if (localStorage.getItem('tokenMC')) {
        this.listProductionsMounted();
      } else {
        this.$router.push('/');
      }
    },
  },
  components: {
    FormProductions,
  },
};
</script>
