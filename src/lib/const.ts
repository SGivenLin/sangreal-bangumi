export const baseUrl = 'https://bangumi.tv'

export const jobMap = {
    '监督': ['监督', '导演', '副导演', '总导演', '系列监督', '联合导演'],
    '动画公司': ['动画制作', '制作', '製作', '制作协力', '音乐制作', '友情協力'],
    '音乐': ['音响监督', '音乐', '音效', '主题歌演出', '主题歌作词', '主题歌作曲', '主题歌编曲', '插入歌演出', '录音', '录音助理', '音响', '配音监督'],
    '作画': ['原画', '背景美术', '作画监督', '总作画监督', '美术监督', '美术设计', '补间动画', '第二原画', '动作作画监督', '机械作画监督', '设定', '动画检查'],
    '脚本': ['系列构成', '脚本', '原作', '原案', '背景设定', '台词编辑'],
    'CG': ['CG 导演', '特效', '数码绘图', '摄影监督', '3DCG', 'CG'],
    '其他': null,
}

export const allRelation = Object.values(jobMap).filter(Boolean).flat() as unknown as string[]

interface Images {
    large?: string,
    common?: string,
    medium?: string,
    small?: string,
    grid?: string,
}

export type {
    Images,
}