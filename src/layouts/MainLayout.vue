<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
          <q-toolbar-title>
            {{$router.currentRoute.name}}
          </q-toolbar-title>
          <q-btn
            class="q-mr-xs"
            size="sm"
            color="white"
            text-color="primary"
            icon-right="sync"
            label="Sincronizar"
            @click="showSynchronizeConfirm=true">
            <q-badge v-if="pendingTickets && pendingTickets.length > 0 " color="red" floating>
              {{ pendingTickets.length }}
            </q-badge>
          </q-btn>
          <q-btn-dropdown
            color="primary"
            class="no-shadow"
            push
            no-caps
            label="Perfil"
          >
            <div class="row no-wrap q-pa-md">
              <div class="column items-center">
                <q-avatar size="72px">
                  <img src="~/assets/default-profile-picture.png">
                </q-avatar>
                <div
                  class="text-subtitle1 q-mt-xs text-weight-bolder"
                >
                  {{ name }}
                </div>
                <div
                  v-for="role in roles"
                  :key="role"
                >
                  {{ role }}
                </div>
                <q-btn
                  color="primary"
                  label="Cambiar contraseña"
                  push
                  size="sm"
                  v-close-popup
                  @click="showChangePasswordForm()"
                />
                <q-btn
                  color="primary"
                  label="Cerrar sesión"
                  push
                  size="sm"
                  class="q-mt-sm"
                  @click="logout()"
                  v-close-popup
                />
              </div>
            </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          <img src="~/assets/logo-rectangle.png" width="250" class="q-mr-auto q-ml-auto">
        </q-item-label>
        <EssentialLink
            key="home-menu"
            title="Inicio"
            link="/home"
            icon="home"
            :class="'/home' === $router.currentRoute.name && 'bg-blue-grey-3'"
            :clickable="'/home' !== $router.currentRoute.path"
            :active="'/home' === $router.currentRoute.path"
          />
        <q-expansion-item
          v-for="({ name, icon, label, options }) in linksData"
          expand-separator
          :key="name"
          :icon="icon"
          :label="label"
        >

          <EssentialLink
            v-for="({ name, route }) in options"
            :key="name"
            :title="name"
            :link="route"
            :class="route === $router.currentRoute.name && 'bg-blue-grey-3'"
            :classes="'q-ml-lg'"
            :clickable="route !== $router.currentRoute.path"
            :active="route === $router.currentRoute.path"
          />
        </q-expansion-item>
      </q-list>
      <q-item-label header class="text-grey-8 text-center q-mt-md">
        {{ versionApp }}
      </q-item-label>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
    <form-change-password
      ref="formChangePasswordReference"
      :titleRef="title"
    />
    <q-dialog
      v-model="showSynchronizeConfirm"
      persistent
    >
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar
            size="sm"
            icon="sync"
            color="primary"
            text-color="white"
          />
          <span class="q-ml-sm">
            Realizar sincronización?
          </span>
        </q-card-section>

        <q-card-actions align="right">
          <div class="row text-center">
            <q-btn label="Cancelar"
              type="reset"
              color="primary"
              outline class="col"
              @click="showSynchronizeConfirm = false"
            />
            <q-btn
              label="Aceptar"
              type="submit"
              color="primary"
              class="col q-ml-sm"
              @click="synchronization"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!--warnings card-->
    <div class="q-pa-md">
      <q-dialog
        v-model="showModalWarnigs"
        persistent
      >
        <q-card style="width: 900px; max-width: 90vw;">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Advertencias</div>
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
            style="max-height: 70vh"
            class="scroll"
          >
            <div class="q-pa-md">
              <q-list
                v-if="showWarningCreatedSection"
                bordered
              >
                <q-item-label
                  header
                  class="q-pb-xs"
                >
                  <strong>Registro de nuevos tiquetes:</strong> un intento de registro de nuevos tiquetes no ha cumplido alguna de las siguientes normas
                </q-item-label>
                <q-item>
                  <q-item-section>
                    <span
                      v-for="(message, index) in synchronizationWarningResponseMessages.tc"
                      :key="index"
                    >
                      {{message}}
                    </span>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-list
                v-if="showWarningUpdatedSection"
                bordered
              >
                <q-item-label
                  header
                  class="q-pb-xs"
                >
                  <strong>Actualización de tiquetes:</strong> un intento de actualización de tiquetes que han sido cargados cargados previamente, no ha cumplido alguna de las siguientes normas
                </q-item-label>
                <q-item>
                  <q-item-section>
                    <span
                      v-for="(message, index) in synchronizationWarningResponseMessages.tu"
                      :key="index"
                    >
                      {{message}}
                    </span>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-list
                v-if="showWarningDeletedSettledSection"
                bordered
              >
                <q-item-label
                  header
                  class="q-pb-xs"
                >
                  <strong>Eliminación de tiquetes ya liquidados:</strong> se intentó eliminar un tiquete que ya ha sido liquidado. No se requiere ninguna acción ya que el sistema ignorará esta acción.
                </q-item-label>
                <q-item>
                  <q-item-section>
                    <span
                      v-for="(message, index) in synchronizationWarningResponseMessages.tds"
                      :key="index"
                    >
                      {{message}}
                    </span>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-list
                v-if="showWarningUpdatedSettledSection"
                bordered
              >
                <q-item-label
                  header
                  class="q-pb-xs"
                >
                  <strong>Actualización de tiquetes ya liquidados:</strong> se intentó actualizar un tiquete que ya ha sido liquidado. Se recomienda corregir el/los tiquete/s o bien eliminarlos de forma local para que esta actualización sea ignorada
                </q-item-label>
                <q-item>
                  <q-item-section>
                    <span
                      v-for="(message, index) in synchronizationWarningResponseMessages.tus"
                      :key="index"
                    >
                      {{message}}
                    </span>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
          <q-card-actions vertical align="center">
            <q-btn label="Cerrar"
              type="reset"
              color="primary"
              outline class="col"
              v-close-popup
              @click="showModalWarnigs = false"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import EssentialLink from 'components/common/EssentialLink.vue';
import FormChangePassword from 'components/user/FormChangePassword.vue';
import localDataManagementTypes from '../store/modules/localDataManagement/types';
import synchronizationTypes from '../store/modules/synchronization/types';
import commonTypes from '../store/modules/common/types';
import { showNotifications } from '../helpers/showNotifications';
import { showLoading } from '../helpers/showLoading';

export default {
  name: 'MainLayout',
  components: {
    EssentialLink,
    FormChangePassword,
  },
  data() {
    return {
      leftDrawerOpen: false,
      title: 'Inicio',
      showModalChangePassword: false,
      linksData: [],
      showSynchronizeConfirm: false,
      statusSendingData: false,
      showModalWarnigs: false,
    };
  },
  async mounted() {
    this.listThirds();
    this.listMaterials();
    this.listYards();
    this.getData();
    await this.fillLinkData();
  },
  computed: {
    ...mapState(commonTypes.PATH, [
      'statusSign',
      'responseMessages',
      'menu',
      'currentRoute',
      'name',
      'roles',
    ]),
    ...mapState(localDataManagementTypes.PATH, {
      localDataManagementData: 'data',
      localDataManagementStatus: 'status',
      localDataManagementResponseMessages: 'responseMessages',
      thirds: 'localThirds',
      yards: 'localYards',
      materials: 'localMaterials',
    }),
    ...mapState(synchronizationTypes.PATH, {
      synchronizationData: 'data',
      synchronizationStatus: 'status',
      synchronizationResponseMessages: 'responseMessages',
      synchronizationWarningResponseMessages: 'warningResponseMessages',
    }),
    showWarningCreatedSection() {
      if (
        this.synchronizationWarningResponseMessages
        && this.synchronizationWarningResponseMessages.tc
        && this.synchronizationWarningResponseMessages.tc.length > 0
      ) {
        return true;
      }
      return false;
    },
    showWarningUpdatedSection() {
      if (
        this.synchronizationWarningResponseMessages
        && this.synchronizationWarningResponseMessages.tu
        && this.synchronizationWarningResponseMessages.tu.length > 0
      ) {
        return true;
      }
      return false;
    },
    showWarningUpdatedSettledSection() {
      if (
        this.synchronizationWarningResponseMessages
        && this.synchronizationWarningResponseMessages.tus
        && this.synchronizationWarningResponseMessages.tus.length > 0
      ) {
        return true;
      }
      return false;
    },
    showWarningDeletedSettledSection() {
      if (
        this.synchronizationWarningResponseMessages
        && this.synchronizationWarningResponseMessages.tds
        && this.synchronizationWarningResponseMessages.tds.length > 0
      ) {
        return true;
      }
      return false;
    },
    versionApp() {
      return `Version ${process.env.LATEST_VERSION_APP}`;
    },
    pendingTickets() {
      return this.localDataManagementData.filter((result) => (result.modified === 1 && !(result.synchronized === 0 && result.deleted === 1)));
    },
  },
  methods: {
    ...mapActions(commonTypes.PATH, {
      signout: commonTypes.actions.SIGN_OUT,
    }),
    clickChangePassword() {
      this.showModalChangePassword = true;
    },
    ...mapActions(localDataManagementTypes.PATH, {
      getData: localDataManagementTypes.actions.GET_DATA,
      setData: localDataManagementTypes.actions.SET_DATA,
      listThirds: localDataManagementTypes.actions.LIST_LOCAL_THIRDS,
      listMaterials: localDataManagementTypes.actions.LIST_LOCAL_MATERIALS,
      listYards: localDataManagementTypes.actions.LIST_LOCAL_YARDS,
    }),
    ...mapActions(synchronizationTypes.PATH, {
      synchronize: synchronizationTypes.actions.SYNCHRONIZATION_SYNCHRONIZE,
    }),
    async logout() {
      showLoading('Cerrando sesión ...', 'Por favor, espere', true);
      await this.signout();
      if (this.statusSign === true) {
        this.$q.loading.hide();
        this.$router.push('/');
      } else {
        this.$q.loading.hide();
        this.showNotification(this.responseMessages, this.statusSign, 'top-right', 5000);
      }
    },
    async fillLinkData() {
      console.log('menuuu', this.menu);
      if (this.menu) {
        this.menu.forEach((item) => {
          this.linksData.push(
            {
              label: item.label,
              options: item.options.filter((i) => i.menu === 1),
              icon: item.icon,
              link: item.route,
              open: true,
            },
          );
        });
      }
    },
    async synchronization() {
      this.showSynchronizeConfirm = false;
      if (this.localDataManagementStatus === true) {
        await this.synchronize(this.localDataManagementData);
        if (this.synchronizationStatus === true) {
          this.showNotification(this.synchronizationResponseMessages, this.synchronizationStatus, 'top-right', 5000);
          await this.setData(this.synchronizationData);
          if (this.localDataManagementStatus === false) {
            this.showNotification(this.localDataManagementResponseMessages, this.localDataManagementStatus, 'top-right', 5000);
          } else {
            this.showNotification(this.localDataManagementResponseMessages, this.localDataManagementStatus, 'top-right', 5000);
          }
        } else {
          this.showNotification(this.synchronizationResponseMessages, this.synchronizationStatus, 'top-right', 5000);
        }
        this.showWarnings();
        this.listThirds();
        this.listMaterials();
        this.listYards();
        this.getData();
        await this.fillLinkData();
      } else {
        this.showNotification(this.localDataManagementResponseMessages, this.localDataManagementStatus, 'top-right', 5000);
      }
    },
    showChangePasswordForm() {
      showLoading('Preparando formulario ...', 'Por favor, espere', true);
      this.$refs.formChangePasswordReference.showModal();
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    showWarnings() {
      if (
        this.showWarningCreatedSection === true
        || this.showWarningUpdatedSection === true
        || this.showWarningUpdatedSettledSection === true
        || this.showWarningDeletedSettledSection === true
      ) {
        this.showModalWarnigs = true;
      }
    },
  },
};
</script>
