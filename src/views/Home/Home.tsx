import './Home.styl'
import { Button, Card, Divider } from "antd"
import router from 'src/component/Layout/router'
import { CommonRouterLink } from 'src/component/common/link'

const Home = () => {
    return <Card className='home'>
        <header className="home-title">圣杯-bangumi</header>
        <div className='home-content'>
            本应用基于<a href='https://bangumi.tv' target='_blank' rel="noreferrer">bangumi.tv</a>，使用其提供的数据，进行动画数据分析服务
            <Divider></Divider>
            <div className='fn-list'>
                { router.slice(1).map(item => {
                    return <CommonRouterLink route={item}>
                        <Card className='fn-item'>
                            <div><img src={item.homeImg} alt={item.sider?.label}></img></div>
                            <Button block type='link' className='fn-link'>{item.sider?.label}</Button>
                            <div className='desc'>{ item.desc }</div> 
                        </Card>
                    </CommonRouterLink>
                })}
            </div>
        </div>
    </Card>
}

export default Home