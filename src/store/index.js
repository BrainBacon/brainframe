import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import TwitchJs from 'twitch-js';

const {
  client,
  secret,
  oauth,
  username,
} = process.env.PROPERTIES.secrets;

Vue.use(Vuex);

let initTwitchJs;
let chatClient;

export default new Vuex.Store({
  state: {
    token: null,
    expires: null,
    type: null,
  },
  mutations: {
    setToken(state, { access_token, expires_in, token_type }) {
      state.token = access_token;
      state.expires = expires_in;
      state.type = token_type;
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
            client_id: client,
            client_secret: secret,
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
          username,
          token: oauth,
        });
      }
      return chatClient;
    },
  },
});
