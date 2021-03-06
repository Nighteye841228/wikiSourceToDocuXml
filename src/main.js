import Vue from 'vue';
import Buefy from 'buefy';
import App from './App.vue';
import 'buefy/dist/buefy.css';
import CompositionApi from '@vue/composition-api';

Vue.use(CompositionApi);
Vue.use(Buefy);
Vue.config.productionTip = false;

new Vue({
    render: (h) => h(App),
}).$mount('#app');
