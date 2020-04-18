<script>
import { mapActions, mapState } from 'vuex';

const { version } = process.env.PROPERTIES;

export default {
  data() {
    return {
      message: '',
    };
  },

  computed: {
    ...mapState(['messages']),
    version: () => version,
  },

  methods: {
    ...mapActions(['connectChat', 'chatSay']),

    async say() {
      await this.chatSay(this.message);
    },
  },

  async mounted() {
    await this.connectChat();
  },
};
</script>

<template lang="pug">
Article
  form(@submit.prevent="say")
    input(type="text" v-model="message")
    button(type="submit") submit
  div(v-for="message in messages")
    p {{ message.username }}: {{ message.message }}
  div {{ version }}
</template>
