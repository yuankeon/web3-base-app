import { getTokens } from '@/api/approve'
import { SvgIcon } from '@/components/SvgIcon'
import { message, Input, Divider, Button, InputRef } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { reduceData } from '@/utils'
import { PairItem } from '@/types/app'
import { TokenMaps, TITLE } from '@/config'
import { isAddress } from '@ethersproject/address'
import { useApprove } from '@/hooks/useApprove'

export function ContentList() {
  const [pairList, setPairList] = useState<PairItem[] | undefined>()
  const inputRef = useRef<InputRef>(null)

  function getPairList() {
    getTokens()
      .then((res) => {
        if (res.code === 200) {
          const data = reduceData(res.data)
          setPairList(data)
        } else {
          throw new Error('请求成功了, 但code不为200')
        }
      })
      .catch((error: Error) => {
        message.error({
          content: error.message,
        })
      })
  }

  useEffect(() => {
    getPairList()
  }, [])

  const { signApprove } = useApprove()

  const handleApprove = (pair: PairItem, input: InputRef | null) => {
    //授权合约
    const spenderAddress = inputRef.current?.input?.value || ''
    if (isAddress(spenderAddress)) {
      const inputValue = input?.input?.value || ''
      if (!inputValue || isNaN(Number(inputValue))) {
        //输入为空或者非数字
        message.error('请输入大于0的数字')
      } else {
        const data = signApprove({
          amountDecimal: inputValue,
          spender: spenderAddress,
          approveToken: pair.tokenAddress,
        })
        console.log(data)
      }
    } else {
      message.error('请输入正确的合约地址')
    }
  }

  return (
    <div className="card">
      <div className="form-item">
        <span>当前环境:</span>
        <span>DEV</span>
      </div>

      <div className="form-item">
        <span>授权合约:</span>
        <Input style={{ width: '80%' }} ref={inputRef} />
      </div>
      <Divider plain>Token List</Divider>

      <div className="list-title">
        {TITLE.map((item, index) => (
          <div
            key={item.title}
            style={{
              width: item.width,
              textAlign: index === 3 ? 'center' : 'left',
            }}
          >
            {item.title}
          </div>
        ))}
      </div>

      <div className="pair-content">
        {!pairList
          ? 'loading...'
          : pairList.map((item) => (
              <ContentListItem
                key={item.tokenAddress}
                item={item}
                handleApprove={handleApprove}
              />
            ))}
      </div>
    </div>
  )
}

function ContentListItem({
  item,
  handleApprove,
}: {
  item: PairItem
  handleApprove: (data: PairItem, amount: InputRef | null) => void
}) {
  const itemImputRef = useRef<InputRef>(null)

  return (
    <div className="pair-list">
      <div
        style={{
          width: TITLE[0].width,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <SvgIcon
          iconName={TokenMaps[item.tokenName]}
          width="20px"
          height="20px"
        />
        <span>{item.symbol}</span>
      </div>
      <div style={{ width: TITLE[1].width }}>0</div>
      <div style={{ width: TITLE[2].width }}>
        <Input style={{ width: '80%' }} ref={itemImputRef} />
      </div>
      <div style={{ width: TITLE[3].width, textAlign: 'center' }}>
        <Button
          type="link"
          onClick={() => handleApprove(item, itemImputRef.current)}
        >
          Approve
        </Button>
      </div>
    </div>
  )
}
