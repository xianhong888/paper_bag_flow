// 箱包项目使用
export const money = (v: number): string => '¥' + Number(v).toFixed(2)

export const num = (v: number): string => Number(v).toLocaleString('zh-CN')

const statusMap: Record<string, string> = {
  已完成: 'green',
  已确认: 'green',
  已发货: 'green',
  在售: 'blue',
  生产中: 'blue',
  待确认: 'orange',
  待发货: 'orange',
  待生产: 'purple',
  有差异: 'red',
  待处理: 'red',
  进行中: 'orange',
  待执行: 'gray'
}

export const statusClass = (s: string): string => statusMap[s] ?? 'gray'