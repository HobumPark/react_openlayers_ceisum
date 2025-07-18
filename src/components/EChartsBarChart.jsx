import React from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * @param {{
 *  title?: string,
 *  categories: string[],
 *  series: { name: string, data: number[] } | { name: string, data: number[] }[],
 *  width?: string | number,
 *  height?: string | number
 * }} props
 */
const EChartsBarChart = ({ title = '바 차트', categories, series, width = '100%', height = 400, fullTimestamps }) => {
  const seriesArray = Array.isArray(series) ? series : [series];

  const option = {
    title: {
      text: title,
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const index = params[0].dataIndex;
        const fullTime = fullTimestamps?.[index] || '';
        const lines = [`<b>${fullTime}</b>`];
        params.forEach(p => {
          lines.push(`${p.marker} ${p.seriesName}: ${p.data}`);
        });
        return lines.join('<br/>');
      }
    },
    legend: {
      data: seriesArray.map(s => s.name),
    },
    xAxis: {
      type: 'category',
      data: categories,
      boundaryGap: true,
    },
    yAxis: {},
    series: seriesArray.map(s => ({
      name: s.name,
      type: 'bar',
      data: s.data,
    })),
    dataZoom: [
      {
        type: 'slider', // 화면 아래 슬라이더
        start: 0,
        end: 100, // 초기 보여주는 비율 조절
        handleSize: '80%',
      },
      {
        type: 'inside', // 마우스 휠, 드래그로 줌/팬 가능
        start: 0,
        end: 100,
      },
    ],
  };

  return <ReactECharts option={option} style={{ width, height }} />;
};

export default EChartsBarChart;
