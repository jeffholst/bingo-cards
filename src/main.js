import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import AmplifyVue from '@aws-amplify/ui-vue';
import "@aws-amplify/ui-vue/styles.css";

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

import PubSub from "@aws-amplify/pubsub";

import { createPinia } from 'pinia'

Amplify.configure(awsconfig);
PubSub.configure(awsconfig);

const app = createApp(App);
app.use(AmplifyVue);
app.use(createPinia())
app.mount('#app');
