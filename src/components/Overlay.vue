<script>
import { mapActions } from 'vuex';

const { version, secrets } = process.env.PROPERTIES;

export default {
  data() {
    return {
      message: '',
    };
  },

  computed: {
    version: () => version,
  },

  methods: {
    ...mapActions(['getTwitchJs', 'getChatClient']),

    say() {
      this.chatClient.chat.say('brain_bacon', this.message);
    },
  },


  async mounted() {
    this.TwitchJs = await this.getTwitchJs();
    this.chatClient = await this.getChatClient();
    let { chat } = this.chatClient;
    await chat.connect();
    await chat.join(secrets.channel);
    // chat.say('brain_bacon', 'Hello world');
  },
};
</script>

<template lang="pug">
Article
  form(@submit.prevent="say")
    input(type="text" v-model="message")
    button(type="submit") submit
  div {{ version }}
</template>
