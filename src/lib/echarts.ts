import * as echarts from 'echarts/core';
import {
  BarChart,
  PieChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  // 数据集组件
  DatasetComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
  LegendComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import type {
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption, 
  PieSeriesOption,
} from 'echarts/charts';
import type {
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption
} from 'echarts/components';
import type { 
  ComposeOption, 
} from 'echarts/core';
import { useEffect, useRef } from 'react';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = ComposeOption<
  | BarSeriesOption
  | PieSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>;

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
]);

function useEcharts(option: ECOption) {
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
      const myChart = echarts.init(domRef.current);
      myChart.setOption(option)
      const resize = () => myChart.resize()
      window.addEventListener('resize', resize)
      return () => {
          window.removeEventListener('resize', resize)
      }
  }, [option])

  return domRef
}

export default echarts
export { useEcharts }
export type { ECOption }