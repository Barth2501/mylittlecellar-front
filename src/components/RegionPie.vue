  <template>
  <v-list>
    <v-card outlined color="transparent">
      <v-card-title>Repartition de la cave en région</v-card-title>
      <v-card-text>
        <div id="region_chart"></div>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title v-if="currentRegion!=''">Repartition de la cave dans la region {{currentRegion}}</v-card-title>
      <v-card-text>
        <div id="area_chart"></div>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title v-if="currentRegion!='' && currentArea===''">Repartition des millésimes de la région {{currentRegion}}</v-card-title>
      <v-card-title v-if="currentArea!=''">Repartition des millésimes de l'appelation {{currentArea}}</v-card-title>
      <v-card-text>
        <div id="vintage_chart"></div>
      </v-card-text>
    </v-card>
  </v-list>
</template>
<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

export default {
  props: [
    "region_agg",
    "area_agg",
    "vintage_agg",
    "region_vint_agg",
    "area_vint_agg"
  ],
  data: () => ({
    vintageColumnData: [],
    areaPieData: [],
    currentRegion: "",
    currentArea: "",
    regionPie: undefined,
    areaPie: undefined,
    vintageColumn: undefined
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
          this.currentArea = '';
        this.currentRegion = ev.target.dataItem.category;
        this.areaPieData = this.area_agg[this.currentRegion];
        this.vintageColumnData = this.region_vint_agg[this.currentRegion];
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
        this.vintageColumnData = this.area_vint_agg[this.currentArea];
      },
      this
    );
    // VintageColumn Config
    this.vintageColumn = am4core.create("vintage_chart", am4charts.XYChart);
    let categoryAxis = this.vintageColumn.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "vintage";
    categoryAxis.title.text = "Vintage";
    let valueAxis = this.vintageColumn.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Number of bottles";
    let vintageSeries = this.vintageColumn.series.push(
      new am4charts.ColumnSeries()
    );
    vintageSeries.dataFields.valueY = "number";
    vintageSeries.dataFields.categoryX = "vintage";
  },
  methods: {
    showRegionPie() {
      this.regionPie.data = this.region_agg;

      // Add and configure Series
    },
    showAreaPie() {
      if (this.areaPieData.length === undefined) {
        this.areaPie.data = [this.areaPieData];
      } else {
        this.areaPie.data = this.areaPieData;
      }
    },
    showVintageColumn() {
        console.log(this.vintageColumnData)
      if (this.vintageColumnData.length === undefined) {
        this.vintageColumn.data = [this.vintageColumnData];
      } else {
        this.vintageColumn.data = this.vintageColumnData;
      }
    }
  },
  watch: {
    region_agg: function() {
      this.showRegionPie();
    },
    areaPieData: function() {
      this.showAreaPie();
    },
    vintage_agg: function() {
        this.vintageColumnData = this.vintage_agg;
    },
    vintageColumnData: function() {
      this.showVintageColumn();
    }
  }
};
</script>