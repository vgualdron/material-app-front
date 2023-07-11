<template>
  <q-item
    :clickable="clickable"
    tag="a"
    @click="clickOption(link, title)"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <!-- <q-item-label caption>
        {{ caption }}
      </q-item-label> -->
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },

    link: {
      type: String,
      default: '#',
    },

    icon: {
      type: String,
      default: '',
    },

    clickable: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    clickOption(link, title) {
      this.$router.push(link);
      this.$emit('changeMenu', title);
    },
  },
};
</script>
