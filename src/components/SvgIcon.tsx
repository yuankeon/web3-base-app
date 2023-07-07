export function SvgIcon({
  width = '16px',
  height = '16px',
  iconName,
  color,
}: {
  width?: string
  height?: string
  iconName: string
  color?: string
}) {
  return (
    // <!-- href 执行用哪一个图标，属性值固定为 #icon-图标名字 -->
    <svg style={{ width, height }}>
      <use href={`#icon-${iconName}`} fill={color} />
    </svg>
  )
}
