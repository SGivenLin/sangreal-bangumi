import { type FC, useEffect } from 'react'
import './CollectionChartView.styl'
import echarts from 'src/lib/echarts'
import { Card } from 'antd'
import { useAppSelector } from 'src/store'
import CollectionData from 'src/component/Collection/CollectionData'

const CollectionChartView: FC = () => {
    const collectionList = useAppSelector(state => state.collection.collectionList)

    useEffect(() => {
        const collectionData = new CollectionData(collectionList)
        const option = {
            legend: {},
            tooltip: {},
            xAxis: {
                data: CollectionData.groupRateList.map(CollectionData.groupRate2Str)
              },
            yAxis: {},
            series: [
                {
                    type: 'bar',
                    data: Array.from(collectionData.groupCollectionByRate().values()).map(item => item.length)
                }
            ]
        };
        const myChart = echarts.init(document.getElementById('ddd'));
        myChart.setOption(option)
        const resize = () => myChart.resize()
        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [collectionList])
    return <Card>
        <Card title="评分分布">
            <div id="ddd" style={{ width: '50%', height: '260px' }}></div>
        </Card>
    </Card>
}

export default CollectionChartView