  <template>
  <v-list>
    <v-card outlined color="transparent">
      <v-card-title>Repartition de la cave en région</v-card-title>
      <v-card-text>
        <div v-if="regionChartLoading">
          <v-col>
            <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear>
          </v-col>
        </div>
        <div id="region_chart"></div>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title v-if="currentRegion!=''">
        Repartition de la cave dans la region
        <a
          class="ml-1"
          href="$router.push('/regions/'+currentRegion)"
        >{{currentRegion}}</a>
      </v-card-title>
      <v-card-text>
        <div v-if="areaChartLoading">
          <v-col>
            <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear>
          </v-col>
        </div>
        <div id="area_chart"></div>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title v-if="currentRegion!='' && currentArea===''">
        Repartition des millésimes de la région
        <a
          class="ml-1"
          href="$router.push('/regions/'+currentRegion)"
        >{{currentRegion}}</a>
      </v-card-title>
      <v-card-title v-if="currentArea!=''">
        Repartition des millésimes de l'appelation
        <a
          class="ml-1"
          href="$router.push('/areas/'+currentArea)"
        >{{currentArea}}</a>
      </v-card-title>
      <v-card-title v-if="currentRegion!='' && currentArea!=''">
        Repartition des millésimes de la cave
      </v-card-title>
      <v-card-text>
        <div v-if="vintageChartLoading">
          <v-col>
            <v-progress-linear color="deep-purple accent-4" indeterminate rounded height="6"></v-progress-linear>
          </v-col>
        </div>
        <div id="vintage_chart"></div>
      </v-card-text>
    </v-card>
  </v-list>
</template>
<script>
import axios from "axios";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

export default {
  props: [],
  data: () => ({
    currentCellar: undefined,
    // region_agg: undefined,
    // area_agg: undefined,
    currentRegion: "",
    currentArea: "",
    regionChartLoading: false,
    areaChartLoading: false,
    vintageChartLoading: false
  }),
  mounted() {
    // RegionPie config
    this.regionPie = am4core.create("region_chart", am4charts.PieChart);
    this.regionPie.innerRadius = am4core.percent(40);
    let pieSeries = this.regionPie.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "number";
    pieSeries.dataFields.category = "region_name";
    pieSeries.slices.template.stroke = am4core.color("#4a2abb");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.events.on(
      "hit",
      function(ev) {
        this.currentRegion = ev.target.dataItem.category;
        this.getAreaAgg(ev.target.dataItem.category);
        this.getVintageAgg(ev.target.dataItem.category);
      },
      this
    );
    // AreaPie Config
    this.areaPie = am4core.create("area_chart", am4charts.PieChart);
    this.areaPie.innerRadius = am4core.percent(40);
    let AreaPieSeries = this.areaPie.series.push(new am4charts.PieSeries());
    AreaPieSeries.dataFields.value = "number";
    AreaPieSeries.dataFields.category = "area_name";
    AreaPieSeries.slices.template.stroke = am4core.color("#4a2abb");
    AreaPieSeries.slices.template.strokeWidth = 2;
    AreaPieSeries.slices.template.strokeOpacity = 1;
    AreaPieSeries.slices.template.events.on(
      "hit",
      function(ev) {
        this.currentArea = ev.target.dataItem.category;
        // this.vintageColumnData = this.area_vint_agg[this.currentArea];
        this.getVintageAgg(ev.target.dataItem.category);
      },
      this
    );
    // VintageColumn Config
    this.vintageColumn = am4core.create("vintage_chart", am4charts.XYChart);
    let categoryAxis = this.vintageColumn.xAxes.push(
      new am4charts.CategoryAxis()
    );
    categoryAxis.dataFields.category = "vintage";
    categoryAxis.title.text = "Vintage";
    let valueAxis = this.vintageColumn.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Number of bottles";
    let vintageSeries = this.vintageColumn.series.push(
      new am4charts.ColumnSeries()
    );
    vintageSeries.dataFields.valueY = "number";
    vintageSeries.dataFields.categoryX = "vintage";
    this.getRegionAgg();
    this.getVintageAgg("every_wines");
  },
  methods: {
    async getRegionAgg() {
      this.regionChartLoading = true;
      const res = await axios.get("/statistics/region_agg", {
        headers: { current_cellar_id: this.currentCellar.id }
      });
      console.log(res.data);
      this.regionPie.data = res.data.region_agg;
      this.regionChartLoading = false;
    },
    async getAreaAgg(region_name) {
      this.areaChartLoading = true;
      const res = await axios.get("/statistics/area_agg/" + region_name, {
        headers: { current_cellar_id: this.currentCellar.id }
      });
      console.log(res.data);
      this.areaPie.data = res.data.area_agg;
      this.areaChartLoading = false;
    },
    async getVintageAgg(name) {
      this.vintageChartLoading = true;
      // it can be a area vintage aggregation or a region's
      // that is why name is not precised
      const res = await axios.get("/statistics/vintage_agg/" + name, {
        headers: { current_cellar_id: this.currentCellar.id }
      });
      console.log(res.data);
      this.vintageColumn.data = res.data.vintage_agg;
      this.vintageChartLoading = false;
    },
    // showRegionPie() {
    //    = this.region_agg;

    //   // Add and configure Series
    // },
    // showAreaPie() {
    //   if (this.areaPieData.length === undefined) {
    //      = [this.areaPieData];
    //   } else {
    //     this.areaPie.data = this.areaPieData;
    //   }
    // },
    showVintageColumn() {
      console.log(this.vintageColumnData);
      if (this.vintageColumnData.length === undefined) {
        this.vintageColumn.data = [this.vintageColumnData];
      } else {
        this.vintageColumn.data = this.vintageColumnData;
      }
    }
  },
  watch: {
    // region_agg: function() {
    //   this.showRegionPie();
    // },
    // area_agg: function() {
    //   this.showAreaPie()
    // },
    // areaPieData: function() {
    //   this.showAreaPie();
    // },
    // vintage_agg: function() {
    //   this.vintageColumnData = this.vintage_agg;
    // },
    // vintageColumnData: function() {
    //   this.showVintageColumn();
    // }
  },
  created() {
    if (localStorage.getItem("current_cellar")) {
      try {
        this.currentCellar = JSON.parse(localStorage.getItem("current_cellar"));
      } catch (e) {
        localStorage.removeItem("current_cellar");
      }
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
  color: #c6a47e;
}
</style>