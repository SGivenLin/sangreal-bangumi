import { useAppSelector } from "src/store"
import CollectionData from "../Collection/CollectionData"
import { useEcharts, type ECOption  } from "src/lib/echarts"
import { useNavigate } from 'react-router-dom'
import { build } from 'src/lib/url'
import { FC } from "react"

const TYPE = 'date'
const CollectionDateChartBar: FC<Partial<ECOption>> = (props) =>{
    const option: ECOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '0',
            top: '3%',
            containLabel: true,
        },
        yAxis: {},
        ...props,
    }

    const navigate = useNavigate()
    const domRef = useEcharts(option, echart => {
        echart.on('click', (params) => {
            navigate(build('/collection', { group_name: params.name, group: TYPE }))
        })
    })

    return <div ref={domRef} style={{ height: 300, width: '50%' }}></div>
}

const CollectionDateChartPie: FC<Partial<ECOption>> = (props) =>{
    const option: ECOption = {
        tooltip: {
            trigger: 'item',
        },
        legend: {
            top: '0',
            left: 'center',
            selected: {
                未知: false,
            },
        },
        ...props,
    }

    const navigate = useNavigate()
    const domRef = useEcharts(option, echart => {
        echart.on('click', (params) => {
            navigate(build('/collection', { group_name: params.name, group: TYPE }))
        })
    })

    return <div ref={domRef} style={{ height: 300, width: '50%' }}></div>
}

const CollectionDateChart: FC = () => {
    const collectionList = useAppSelector(state => state.collection.collectionList)
    const collectionData = new CollectionData(collectionList).groupByDate()

    const xAxisBar = { data: CollectionData.groupDateList.map(CollectionData.groupDate2Str), axisLabel: { rotate: 40 } }
    const seriesBar: ECOption['series'] = [
        {
            type: 'bar',
            data: collectionData.map(([ date, list ]) => list.length),
        },
    ]

    const pieData =  collectionData.map(([ date, list ]) => ({
        name: CollectionData.groupDate2Str(date),
        value: list.length,
    }))

    const seriesPie: ECOption['series'] = [
        {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            center: ['50%', '60%'],
            itemStyle: {
                borderRadius: 6,
                borderColor: '#fff',
                borderWidth: 1,
            },
            emphasis: {
                label: {
                    show: true,
                    fontWeight: 'bold',
                    fontSize: 20,
                },
            },
            // selectedMode: 'single',
            label: {
                show: false,
                position: 'center',
                formatter: '{b}\n{d}%',
            },
            labelLine: {
                show: false,
            },
            data: pieData,
        },
    ]

    return (
        <div style={{ display: 'flex' }}>
            <CollectionDateChartBar xAxis={xAxisBar} series={seriesBar}></CollectionDateChartBar>
            <CollectionDateChartPie series={seriesPie}></CollectionDateChartPie>
        </div>
    )
    
}
export default CollectionDateChart