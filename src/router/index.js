import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/Home.vue';
import Hachette from '../components/Hachette.vue';
import MyCellar from '../pages/MyCellar.vue';
import RecipesToWines from '../pages/RecipesToWines.vue';
import WinesToRecipes from '../pages/WinesToRecipes.vue';
import CellarStat from '../pages/CellarStat.vue';
import WineryPage from '../pages/WineryPage.vue';
import AreaPage from '../pages/AreaPage.vue';
import RegionPage from '../pages/RegionPage.vue';
import LookMyWines from '../pages/LookMyWines.vue';
import WinePage from '../pages/WinePage.vue';

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
      path:'/lookmywines',
      name: 'LookMyWines',
      component: LookMyWines,
    },
    {
      path: '/recipes_to_wines',
      name: 'RecipesToWines',
      component: RecipesToWines
    },
    {
      path: '/wines_to_recipes',
      name: 'WinesToRecipes',
      component: WinesToRecipes
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
      path: '/regions/:region_name',
      name: 'region',
      component: RegionPage,
    },
    {
      path: '/wines/:wine_id',
      name: 'wine',
      component: WinePage,
    },
    {
      path: '/winedecider',
      name: 'Winedecider',
      component: Home,
    },
  ],
});

export default router;
