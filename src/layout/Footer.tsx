import { SvgIcon } from '@/components/SvgIcon'

export function Footer() {
  return (
    <a href="https://github.com/yuankeon/web3-base-app" target="__blank">
      <div className="title">
        <SvgIcon iconName="github" width="24px" height="24px" />
        <span>Quick start of your web3 app</span>
        <div style={{ flexGrow: 1 }} />
        <SvgIcon iconName="arrow-up-right" />
      </div>
    </a>
  )
}
