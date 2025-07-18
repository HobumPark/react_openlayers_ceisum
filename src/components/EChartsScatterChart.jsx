import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const EChartsScatterChart = ({
  title = '',
  categories = [],        // x축 카테고리 (옵션)
  fullTimestamps = [],    // x축 타임스탬프 (옵션)
  series = [],            // [{ name, data: [[x, y], [x, y], ...] }, ...]
  height = 400,
  windowSize = 10,
  sliding = false,
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    chartInstance.current = echarts.init(chartRef.current);
    return () => chartInstance.current?.dispose();
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;

    const allCategories = fullTimestamps.length > 0 ? fullTimestamps : categories;
    if (allCategories.length === 0 && series.length === 0) return;

    // 슬라이딩 시 데이터 자르기 (x, y 모두)
    const visibleSeries = series.map((s) => ({
      ...s,
      data: sliding && s.data.length > windowSize ? s.data.slice(-windowSize) : s.data,
      type: 'scatter',
      symbolSize: 8,
    }));

    // x축 데이터 (카테고리 or 숫자형)
    const visibleCategories = sliding && allCategories.length > windowSize
      ? allCategories.slice(-windowSize)
      : allCategories;

    chartInstance.current.setOption({
      title: { text: title, left: 'center' },
      tooltip: { trigger: 'item' },
      xAxis: {
        type: 'category',
        data: series[0]?.data.map(([x]) => x),  // ⬅️ 직접 추출
        name: '시간',
        boundaryGap: true,
        },
      yAxis: {
        type: 'value',
      },
      series: visibleSeries,
      dataZoom: sliding
        ? [
            {
              type: 'slider',
              start: 0,
              end: 100,
              realtime: true,
              showDataShadow: false, // 슬라이더 미니맵 안보이게
            },
            {
              type: 'inside',
              start: 0,
              end: 100,
            },
          ]
        : [
            {
              type: 'slider',
              realtime: true,
              showDataShadow: false,
            },
            {
              type: 'inside',
            },
          ],
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '15%',
        containLabel: true,
      },
    });
  }, [categories, fullTimestamps, series, windowSize, sliding, title]);

  return <div ref={chartRef} style={{ width: '100%', height }} />;
};

export default EChartsScatterChart;
