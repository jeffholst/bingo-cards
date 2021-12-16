import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import AmplifyVue from '@aws-amplify/ui-vue';
import "@aws-amplify/ui-vue/styles.css";

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

import PubSub from "@aws-amplify/pubsub";

Amplify.configure(awsconfig);
PubSub.configure(awsconfig);

const app = createApp(App);
app.use(AmplifyVue);
app.mount('#app');
