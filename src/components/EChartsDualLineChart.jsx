import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const EChartsDualAxisLineChart = ({
  title = '',
  series = [],        // [{ name, data: [[x, y]], yAxisIndex: 0 or 1 }]
  height = 400,
  sliding = false,
  windowSize = 10,
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    chartInstance.current = echarts.init(chartRef.current);
    return () => chartInstance.current?.dispose();
  }, []);

  useEffect(() => {
    if (!chartInstance.current || series.length === 0) return;

    const xLabels = series[0].data.map(([x]) => x); // 시간 기준 x축
    const visibleLabels = sliding ? xLabels.slice(-windowSize) : xLabels;

    const visibleSeries = series.map((s) => ({
      ...s,
      type: 'line',
      smooth: false,
      showSymbol: false,
      data: sliding ? s.data.slice(-windowSize) : s.data,
    }));

    chartInstance.current.setOption({
      title: { text: title, left: 'center' },
      tooltip: { trigger: 'axis' },
      legend: { top: '5%' },
      xAxis: {
        type: 'category',
        data: visibleLabels,
        name: '시간',
        boundaryGap: false,
      },
      yAxis: [
        {
          type: 'value',
          name: '패킷 에러율 (%)',
          position: 'left',
        },
        {
          type: 'value',
          name: 'TX와의 거리 (m)',
          position: 'right',
        },
      ],
      series: visibleSeries,
      dataZoom: sliding
        ? [
            { type: 'slider', start: 0, end: 100, realtime: true, showDataShadow: false },
            { type: 'inside', start: 0, end: 100 },
          ]
        : [],
      grid: {
        left: '5%',
        right: '10%',
        bottom: '10%',
        top: '20%',
        containLabel: true,
      },
    });
  }, [series, windowSize, sliding, title]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

export default EChartsDualAxisLineChart;
