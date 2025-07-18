import React from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * @param {{
 *  title?: string,
 *  seriesName: string,
 *  data: { value: number; name: string }[],
 *  width?: string | number,
 *  height?: string | number,
 * }} props
 */
const EChartsPieChart = ({ title = '파이 차트', seriesName, data, width = '100%', height = 400 }) => {
  const option = {
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: seriesName,
        type: 'pie',
        radius: '50%',
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ width, height }} />;
};

export default EChartsPieChart;
