import { getTokens } from '@/api/approve'
import { SvgIcon } from '@/components/SvgIcon'
import {
  message,
  Input,
  Divider,
  Button,
  InputRef,
  Spin,
  notification,
} from 'antd'
import { useEffect, useRef, useState } from 'react'
import { reduceData } from '@/utils'
import { PairItem } from '@/types/app'
import { TokenMaps, TITLE, TokenDecimalMap } from '@/config'
import { isAddress } from '@ethersproject/address'
import { useApprove } from '@/hooks/useApprove'
import { useUserStore } from '@/store'
import { removeDecimals, addDecimals } from '@/utils/math'

export function ContentList() {
  const [pairList, setPairList] = useState<PairItem[] | undefined>()
  const inputRef = useRef<InputRef>(null)

  const [messageApi, contextHolder] = message.useMessage()
  const [noticeApi, noticeContextHolder] = notification.useNotification()

  const userData = useUserStore((state) => state.userData)
  const { signApprove, batchTokenAllowance } = useApprove()

  function getPairList() {
    getTokens()
      .then(async (res) => {
        const data = reduceData(res.data)
        setPairList(data)
      })
      .catch((error: Error) => {
        messageApi.error({
          content: error.message,
        })
      })
  }

  useEffect(() => {
    getPairList()
  }, [])

  const handleApprove = (
    pair: PairItem,
    amount: string,
    callback: () => void,
  ) => {
    if (!userData?.proxyAddress) {
      messageApi.error('请先登录')
      return
    }
    //授权合约
    const spenderAddress = inputRef.current?.input?.value || ''
    if (isAddress(spenderAddress)) {
      if (!amount || isNaN(Number(amount))) {
        //输入为空或者非数字
        messageApi.error('请输入大于0的数字')
      } else {
        signApprove({
          amountDecimal: addDecimals(amount, TokenDecimalMap[pair.tokenName]),
          spender: spenderAddress,
          approveToken: pair.tokenAddress,
        })
          .then(() => {
            noticeApi.success({
              message: 'Approve success~',
            })
            callback()
          })
          .catch((error) => {
            noticeApi.error({
              message: error.message,
            })
          })
      }
    } else {
      messageApi.error('请输入正确的合约地址')
    }
  }

  const queryAllowance = () => {
    if (!pairList) {
      messageApi.error('未获取到Token列表')
      return
    }
    if (!userData?.proxyAddress) {
      messageApi.error('请先登录')
      return
    }
    //授权合约
    const spenderAddress = inputRef.current?.input?.value || ''
    if (isAddress(spenderAddress)) {
      //批量查询当前合约的allowance
      batchTokenAllowance({
        list: pairList,
        sender: spenderAddress,
        proxy: userData.proxyAddress,
      })
        .then((list) => {
          setPairList(list)
        })
        .catch((error) => {
          messageApi.error(error.message)
        })
    } else {
      messageApi.error('请输入正确的合约地址')
    }
  }

  return (
    <div className="card">
      {contextHolder}
      {noticeContextHolder}
      <div className="form-item">
        <span>当前环境:</span>
        <span>{import.meta.env.VITE_USER_NODE_ENV.toUpperCase()}</span>
      </div>

      <div className="form-item">
        <span>授权合约:</span>
        <Input style={{ width: '64%' }} ref={inputRef} />
        <Button
          type="primary"
          style={{ marginLeft: '8px' }}
          onClick={queryAllowance}
        >
          查询
        </Button>
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
        {!pairList ? (
          <Spin tip="Loading...">
            <div style={{ width: '100%', height: 336 }}></div>
          </Spin>
        ) : (
          pairList.map((item) => (
            <ContentListItem
              key={item.tokenAddress}
              item={item}
              handleApprove={handleApprove}
            />
          ))
        )}
      </div>
    </div>
  )
}

function ContentListItem({
  item,
  handleApprove,
}: {
  item: PairItem
  handleApprove: (data: PairItem, amount: string, callback: () => void) => void
}) {
  const [inputAmount, setInputAmount] = useState('')

  const callback = () => {
    setInputAmount('')
  }

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
      <div style={{ width: TITLE[1].width }}>
        {item.allowance
          ? removeDecimals(item.allowance, TokenDecimalMap[item.tokenName])
          : '~'}
      </div>
      <div style={{ width: TITLE[2].width }}>
        <Input
          style={{ width: '80%' }}
          value={inputAmount}
          onChange={(event) => setInputAmount(event.target.value)}
        />
      </div>
      <div style={{ width: TITLE[3].width, textAlign: 'center' }}>
        <Button
          type="link"
          onClick={() => handleApprove(item, inputAmount, callback)}
        >
          Approve
        </Button>
      </div>
    </div>
  )
}
