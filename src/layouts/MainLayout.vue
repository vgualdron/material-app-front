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
                  <img src="~/assets/flame-partial-logo.png">
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
                  label="Actualizar Perfil"
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
          <img src="~/assets/logo.png" width="250" class="q-mr-auto q-ml-auto">
        </q-item-label>
        <EssentialLink
          v-for="(link) in linksData"
          :key="link.title"
          v-bind="link"
          :class="link.title === $router.currentRoute.name && 'bg-blue-grey-3'"
          :clickable="link.link !== $router.currentRoute.path"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <form-change-password
      ref="formChangePasswordReference"
      :showNotificationsRef="showNotification"
    />
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import EssentialLink from 'components/common/EssentialLink.vue';
import FormChangePassword from 'components/user/FormChangePassword.vue';
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
    };
  },
  async mounted() {
    this.fillLinkData();
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
  },
  methods: {
    ...mapActions(commonTypes.PATH, {
      signout: commonTypes.actions.SIGN_OUT,
    }),
    clickChangePassword() {
      this.showModalChangePassword = true;
    },
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
    fillLinkData() {
      if (this.menu) {
        this.linksData.push(
          {
            title: 'Inicio',
            caption: '',
            icon: 'house',
            link: '/home',
          },
        );
        this.menu.forEach((item) => {
          if (item.menu === 1) {
            this.linksData.push(
              {
                title: item.name,
                caption: '',
                icon: 'remove',
                link: item.route,
              },
            );
          }
        });
      }
    },
    showChangePasswordForm() {
      showLoading('Preparando formulario ...', 'Por favor, espere', true);
      this.$refs.formChangePasswordReference.showModal();
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
