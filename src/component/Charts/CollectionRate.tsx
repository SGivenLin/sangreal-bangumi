import { useAppSelector } from "src/store"
import CollectionData from "../Collection/CollectionData"
import { useEcharts, type ECOption  } from "src/lib/echarts"
import { FC } from "react"

const CollectionRateChartBar: FC = () =>{
    const collectionList = useAppSelector(state => state.collection.collectionList)
    const collectionData = new CollectionData(collectionList)
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
        xAxis: {
            data: CollectionData.groupRateList.map(CollectionData.groupRate2Str),
        },
        yAxis: {},
        series: [
            {
                type: 'bar',
                data: Array.from(collectionData.groupCollectionByRate().values()).map(item => item.length),
            },
        ],
    }

    const domRef = useEcharts(option)

    return <div ref={domRef} style={{ height: 300, width: '50%' }}></div>
}

const CollectionRateChartPie: FC = () =>{
    const collectionList = useAppSelector(state => state.collection.collectionList)
    const collectionData = new CollectionData(collectionList)
    const pieData =  Array.from(collectionData.groupCollectionByRate()).map(([ rate, val ]) => ({
        name: CollectionData.groupRate2Str(rate),
        value: val.length,
    }))

    const option: ECOption = {
        tooltip: {
            trigger: 'item',
        },
        legend: {
            top: '0',
            left: 'center',
            selected: {
                未评分: false,
            },
        },
        series: [
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
        ],
    }

    const domRef = useEcharts(option)

    return <div ref={domRef} style={{ height: 300, width: '50%' }}></div>
}

const CollectionRateChart: FC = () => (
    <div style={{ display: 'flex' }}>
        <CollectionRateChartBar></CollectionRateChartBar>
        <CollectionRateChartPie></CollectionRateChartPie>
    </div>
)

export default CollectionRateChart