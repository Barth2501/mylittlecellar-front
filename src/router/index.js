import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home.vue';
import Hachette from '../components/Hachette.vue';
import MyCellar from '../pages/MyCellar.vue';
import MyRecipes from '../pages/MyRecipes.vue';
import CellarStat from '../pages/CellarStat.vue';
import WineryPage from '../pages/WineryPage.vue';
import AreaPage from '../pages/AreaPage.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Hachette',
      component: Hachette,
    },
    {
      path:'/mycellar',
      name: 'MyCellar',
      component: MyCellar
    },
    {
      path:'/mycellar/stats',
      name: 'CellarStat',
      component: CellarStat
    },
    {
      path: '/myrecipes',
      name: 'MyRecipes',
      component: MyRecipes
    },
    {
      path: '/wineries/:winery_id',
      name: 'winery',
      component: WineryPage,
    },
    {
      path: '/areas/:area_name',
      name: 'area',
      component: AreaPage,
    },
    {
      path: '/winedecider',
      name: 'Winedecider',
      component: Home,
    },
  ],
});

export default router;
