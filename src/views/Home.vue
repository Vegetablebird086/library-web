<template>
  <div>
    <el-row :gutter="10" style="margin-bottom: 60px">
      <el-col :span="6">
        <el-card style="color: #409EFF">
          <div><i class="el-icon-user-solid" /> Total user</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">
            232
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #F56C6C">
          <div><i class="el-icon-money" /> Total lend</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">
            2390
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #67C23A">
          <div><i class="el-icon-bank-card" /> 日借阅</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">
             28
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #E6A23C">
          <div><i class="el-icon-s-shop" /> 月借阅</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">
            693
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div id="main" style="width: 500px; height: 450px"></div>
      </el-col>

      <el-col :span="12">
        <div id="pie" style="width: 500px; height: 400px"></div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: "Home",
  data() {
    return {
      option:{},
      pieOption: {}
    }
  },
  // 折线图 / 饼图 数据
  mounted() {  // 页面元素渲染之后再触发
    var option = {
      title: {
        text: '各quarter会员数量统计',
        subtext: '趋势图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      xAxis: {
        type: 'category',
        data: ["The firstquarter", "The secondquarter", "The thirdquarter", "The forthquarter"]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: "书籍借阅",
          data: [10,22,35,32,26],
          type: 'bar'
        },
        // {
        //   name: "星巴克",
        //   data: [13,14,1,4,5,3],
        //   type: 'line'
        // },
        // {
        //   name: "瑞幸咖啡",
        //   data: [1,2,3,32,2],
        //   type: 'bar'
        // },
        // {
        //   name: "瑞幸咖啡",
        //   data: [1,2,3,32,2],
        //   type: 'line'
        // }
      ]
    };

    // 饼图

    var pieOption = {
      title: {
        text: '各quarter会员数量统计',
        subtext: '比例图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        // {
        //   name: "星巴克",
        //   type: 'pie',
        //   radius: '55%',
        //   center: ['25%', '70%'],
        //   label:{            //饼图图形上的文本标签
        //     normal:{
        //       show:true,
        //       position:'inner', //标签的位置
        //       textStyle : {
        //         fontWeight : 300 ,
        //         fontSize : 14,    //文字的字体大小
        //         color: "#fff"
        //       },
        //       formatter:'{c}({d}%)'
        //     }
        //   },
        //   data: [],  // 填空
        //   emphasis: {
        //     itemStyle: {
        //       shadowBlur: 10,
        //       shadowOffsetX: 0,
        //       shadowColor: 'rgba(0, 0, 0, 0.5)'
        //     }
        //   }
        // },
        {
          name: "瑞幸咖啡",
          type: 'pie',
          radius: '50%',
          center: ['50%', '70%'],
          label:{            //饼图图形上的文本标签
            normal:{
              show:true,
              position:'inner', //标签的位置
              textStyle : {
                fontWeight : 300 ,
                fontSize : 14,    //文字的字体大小
                color: "#fff"
              },
              formatter:'{d}%'
            }
          },
          data: [
            {name: "The firstquarter", value: 5},
            {name: "The secondquarter", value: 6},
            {name: "The thirdquarter", value: 7},
            {name: "The forthquarter", value: 8}
            ],  // 填空
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ],

    };


    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);

    var pieDom = document.getElementById('pie');
    var pieChart = echarts.init(pieDom);
    myChart.setOption(option);
    pieChart.setOption(pieOption);
    // 获取折线图数据
    // this.request.get("/echarts/members").then(res => {
    //   // 填空
    //   // option.xAxis.data = res.data.x
    //   option.series[0].data = res.data
    //   option.series[1].data = res.data
    //
    //   option.series[2].data = [5,6,7,8]
    //   option.series[3].data = [5,6,7,8]
    //   // 数据准备完毕之后再set
    //   myChart.setOption(option);
    //
    //
    //   pieOption.series[0].data = [
    //     {name: "The firstquarter", value: res.data[0]},
    //     {name: "The secondquarter", value: res.data[1]},
    //     {name: "The thirdquarter", value: res.data[2]},
    //     {name: "The forthquarter", value: res.data[3]},
    //   ]
    //   pieChart.setOption(pieOption)
    // })
  }
}
</script>

<style scoped>

</style>
