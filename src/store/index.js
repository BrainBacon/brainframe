import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import TwitchJs from 'twitch-js';

const { secrets } = process.env.PROPERTIES;

Vue.use(Vuex);

let initTwitchJs;
let chatClient;
let chat;

export default new Vuex.Store({
  state: {
    token: null,
    expires: null,
    type: null,
    messages: [],
  },

  mutations: {
    setToken(state, { access_token, expires_in, token_type }) {
      state.token = access_token;
      state.expires = expires_in;
      state.type = token_type;
    },

    addMessage(state, message) {
      state.messages.push(message);
    },
  },

  actions: {
    async getToken({ commit }) {
      try {
        const { data } = await axios.request({
          url: 'https://id.twitch.tv/oauth2/token',
          method: 'post',
          params: {
            grant_type: 'client_credentials',
            client_id: secrets.client,
            client_secret: secrets.secret,
            scopes: '',
          },
        });
        await commit('setToken', data);
        return data.access_token;
      } catch (e) {
        console.error('could not obtain access_token', e);
        throw e;
      }
    },

    async getTwitchJs({ dispatch, state }) {
      if (!initTwitchJs) {
        await dispatch('getToken');
        initTwitchJs = new TwitchJs({
          token: state.token,
          onAuthenticationFailure: async () => {
            await dispatch('getToken');
            return state.token;
          },
        });
      }
      return initTwitchJs;
    },

    async getChatClient() {
      if (!chatClient) {
        chatClient = new TwitchJs({
          username: secrets.username,
          token: secrets.oauth,
        });
      }
      return chatClient;
    },

    /* eslint-disable */
    onMessage({ commit }, message) {
      // { channel, command, event, isSelf, message, tags, color, timestamp, username }
      if (!message.isSelf && !!message.message && message.message !== '' && message.channel === `#${secrets.channel}`) {
        commit('addMessage', message);
      }
    },
    /* eslint-enable */

    async connectChat({ dispatch }) {
      if (!chatClient) {
        await dispatch('getChatClient');
      }
      if (!chat) {
        chat = chatClient.chat;
        await chat.connect();
        await chat.join(secrets.channel);
        chat.on('*', message => dispatch('onMessage', message));
        console.log(chat.events);
      }
    },

    async chatSay({ dispatch }, message) {
      if (!chat) {
        await dispatch('connectChat');
      }
      chat.say(secrets.channel, message);
    },
  },
});
