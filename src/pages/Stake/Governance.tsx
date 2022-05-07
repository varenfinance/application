import React, { useContext, useEffect, useState } from 'react'
import { Text } from 'rebass'
import Card, { BlueCard } from '../../components/Card'
import AppBody from '../AppBody'
import styled, { ThemeContext } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { AutoColumn } from '../../components/Column'
import { RowBetween } from '../../components/Row'
import Question from '../../components/QuestionHelper'
import { useNavigationActiveItemManager } from '../../state/navigation/hooks'
import { displayNumber, numberToPercent, numberToSignificant, numberToUsd } from '../../utils/numberUtils'
import { ButtonSecondary } from '../../components/Button'
import { Link } from 'react-router-dom'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { MARKETCAPS, SINGLE_POOLS, VRN, yVRN } from '../../constants'
import { useActiveWeb3React } from '../../hooks'
import Loader from '../../components/Loader'
import { getContract } from '../../utils'
import { governancePool } from '../../components/ABI'
import { ETH_API_KEYS, getNetworkLibrary, NETWORK_URL } from '../../connectors'
import hexStringToNumber from '../../utils/hexStringToNumber'
import { BigNumber } from 'ethers'
import { useBlockNumber, useWalletModalToggle } from '../../state/application/hooks'
import { useGetTokenPrices, useGetVrnPrice } from '../../state/price/hooks'
import moment from 'moment'
import Countdown from '../../components/Countdown'
import Web3 from 'web3'
import { ExternalButton } from '../../components/PositionCard'

const GovernanceBalance = styled.div`
  display: flex;
  flex: 0 0 100%;
  margin: 0 0 24px;
  font-size: 14px;

  div {
    align-items: flex-start;
  }

  p {
    line-height: 1.4;
  }
`

const UserBalance = styled.div`
  display: flex;
  flex: 0 0 100%;
  margin: 0 0 12px;
  font-size: 14px;

  div {
    align-items: flex-start;
  }

  p {
    line-height: 1.4;
  }
`

const Title = styled.p`
  font-size: 18px;
  margin: 0;
  font-weight: 700;
`

const BalanceText = styled.p`
  margin: 0;
  text-align: right;
`

const VotingButton = styled.a`
  padding: 18px;
  width: 100%;
  font-weight: 500;
  text-align: center;
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: none;
  border: 1px solid transparent;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
  background: ${({ theme }) => theme.buttonBG};
  color: ${({ theme }) => theme.buttonTextColor};
  font-size: 18px;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.buttonBGHover};
    background: ${({ theme }) => theme.buttonBGHover};
    color: ${({ theme }) => theme.buttonTextColorHover};
  }
  &:hover {
    background: ${({ theme }) => theme.buttonBGHover};
    color: ${({ theme }) => theme.buttonTextColorHover};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.buttonBGActive};
    background: ${({ theme }) => theme.buttonBGActive};
    color: ${({ theme }) => theme.buttonTextColorActive};
  }
  }
  `

async function getBlockCountDown(targetBlock: number) {
  const ethAPIKey = ETH_API_KEYS[Math.floor(Math.random() * ETH_API_KEYS.length)]
  try {
    const url = `https://api.etherscan.io/api?module=block&action=getblockcountdown&blockno=${targetBlock}&apikey=${ethAPIKey}`
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    if (response.ok) {
      const content = await response.json()
      if (content.status === '0') {
        return ['']
      } else {
        return content.result.EstimateTimeInSec
      }
    } else {
      return ['']
    }
  } catch (e) {
    console.log(e)
  }
}

async function getIncomingTransactions(senderAddress: string) {
  const ethAPIKey = ETH_API_KEYS[Math.floor(Math.random() * ETH_API_KEYS.length)]
  try {
    const url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0x72377f31e30a405282b522d588aebbea202b4f23&address=${senderAddress}&startblock=0&endblock=999999999&sort=desc&apikey=${ethAPIKey}`
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })

    if (response.ok) {
      const content = await response.json()
      if (content.status === '0') {
        return []
      } else {
        return content.result
      }
    }
  } catch (e) {
    console.log(e)
  }
}

export default function StakeGovernance() {
  const { account } = useActiveWeb3React()
  const fakeAccount = '0x0000000000000000000000000000000000000000'
  const fakeLibrary = getNetworkLibrary()
  const governanceAddress = SINGLE_POOLS.GOV.rewardsAddress
  const theme = useContext(ThemeContext)
  const [govBalanceFetching, setGovBalanceFetching] = useState(false)
  const [yvrnPrice, setYVrnPrice] = useState(0)
  const [yvrnPriceLastMonth, setYVrnPriceLastMonth] = useState(0)
  const [apy, setApy] = useState(0)
  const [totalApy, setTotalApy] = useState(0)
  const [receivedVRNManual, setReceivedVRNManual] = useState(0)
  const [daysSinceLastDistribution, setDaysSinceLastDistribution] = useState(0)
  const toggleWalletModal = useWalletModalToggle()
  const { t } = useTranslation()
  const newActive = useNavigationActiveItemManager()
  const [userBalances, fetchingUserBalances] = useTokenBalancesWithLoadingIndicator(account ?? undefined, [VRN, yVRN])
  const [govBalances, fetchingGovBalances] = useTokenBalancesWithLoadingIndicator(governanceAddress ?? undefined, [VRN])
  const [feeCountdownFetched, setFeeCountdownFetched] = useState(false)
  const [feeCountdown, setFeeCountdown] = useState(0)
  const govContract = getContract(governanceAddress, governancePool, fakeLibrary, fakeAccount)
  const { tokenPrices } = useGetTokenPrices()
  const { vrnPrice } = useGetVrnPrice()
  const yvrnPriceUsd = tokenPrices && yvrnPrice !== 0 ? vrnPrice * yvrnPrice : vrnPrice
  const now = moment().unix()
  const lastBlockNumber = useBlockNumber()
  const numberOfDaysForApy = 60
  const lastMonthBlockNumber = lastBlockNumber ? lastBlockNumber - numberOfDaysForApy * 6408 : 0
  const startDate = moment('07-02-2021', 'MM-DD-YYYY')
  const daysSinceStart = moment().diff(startDate, 'days')
  const vrnStartPrice = 1
  const hasVrn = Number(userBalances[VRN.address]?.toSignificant(1)) > 0
  const hasYVrn = Number(userBalances[yVRN.address]?.toSignificant(1)) > 0
  const totalStaked = Number(govBalances[VRN.address]?.toSignificant(8))
  const percentageStakedTVL = totalStaked / (MARKETCAPS.VRN * 0.01)

  useEffect(() => {
    newActive('stake-governance')
  })

  if (!govBalanceFetching) {
    setGovBalanceFetching(true)

    if (yvrnPrice === 0) {
      const getPricePerFullShareMethod: (...args: any) => Promise<BigNumber> = govContract.getPricePerFullShare
      getPricePerFullShareMethod()
        .then(response => {
          setYVrnPrice(hexStringToNumber(response.toHexString(), yVRN.decimals))
        })
        .catch(e => {
          setYVrnPrice(1)
          console.log(e)
        })
    }

    if (account) {
      const earlyWithdrawalFeeExpiryMethod: (...args: any) => Promise<BigNumber> = govContract.earlyWithdrawalFeeExpiry
      const args: Array<string> = [account]
      earlyWithdrawalFeeExpiryMethod(...args).then(response => {
        getBlockCountDown(hexStringToNumber(response.toHexString(), 0)).then(countdown => {
          setFeeCountdown(now + Math.ceil(countdown))
          setFeeCountdownFetched(true)
        })
      })
    }

    if (receivedVRNManual === 0) {
      getIncomingTransactions('0x0389d755C1833C9b350d4E8B619Eae16deFc1CbA').then(transactions => {
        let VRNManual = 0
        let daysSince = 0
        transactions.forEach(function(transaction: Record<string, any>) {
          if (transaction.to === governanceAddress.toLowerCase()) {
            VRNManual += Number(transaction.value)
            if (daysSince === 0 || moment().diff(moment.unix(transaction.timeStamp), 'days') < daysSince) {
              daysSince = moment().diff(moment.unix(transaction.timeStamp), 'days')
            }
          }
        })
        getIncomingTransactions('0x9dab4dfabc5eca084ffdd386a7b676f2b61bd871').then(transactions => {
          transactions.forEach(function(transaction: Record<string, any>) {
            if (transaction.to === governanceAddress.toLowerCase()) {
              VRNManual += Number(transaction.value)
              if (daysSince === 0 || moment().diff(moment.unix(transaction.timeStamp), 'days') < daysSince) {
                daysSince = moment().diff(moment.unix(transaction.timeStamp), 'days')
              }
            }
          })
          getIncomingTransactions('0x38f10aC1d8512fCCDF5C0201cEF1cBd76D9811B3').then(transactions => {
            transactions.forEach(function(transaction: Record<string, any>) {
              if (transaction.to === governanceAddress.toLowerCase()) {
                VRNManual += Number(transaction.value)
                if (daysSince === 0 || moment().diff(moment.unix(transaction.timeStamp), 'days') < daysSince) {
                  daysSince = moment().diff(moment.unix(transaction.timeStamp), 'days')
                }
              }
            })
            setDaysSinceLastDistribution(daysSince)
            setReceivedVRNManual(VRNManual)
          })
        })
      })
    }
  }
  if (lastMonthBlockNumber !== 0 && yvrnPriceLastMonth === 0) {
    const web3 = new Web3(new Web3.providers.HttpProvider(NETWORK_URL))
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const abstractContract = new web3.eth.Contract(governancePool, governanceAddress)
    abstractContract.methods
      .getPricePerFullShare()
      .call({}, lastMonthBlockNumber)
      .then((response: any) => {
        if (response === null) {
          setYVrnPriceLastMonth(1)
        } else {
          setYVrnPriceLastMonth(hexStringToNumber(response.toHexString(), yVRN.decimals))
        }
      })
      .catch((e: any) => {
        console.log(e)
      })
  }

  if (yvrnPrice > 0 && yvrnPriceLastMonth > 0 && apy === 0) {
    const priceDifference = yvrnPrice - yvrnPriceLastMonth
    const percentageDifference = (priceDifference / ((yvrnPriceLastMonth + yvrnPrice) / 2)) * 100
    const dailyPercentage = percentageDifference / numberOfDaysForApy
    setApy(dailyPercentage * 365 + 0.1)
  }

  if (yvrnPrice > 0 && totalApy === 0) {
    const totalPriceDifference = yvrnPrice - vrnStartPrice
    const totalPercentageDifference = (totalPriceDifference / ((vrnStartPrice + yvrnPrice) / 2)) * 100
    const dailyTotalPercentage = totalPercentageDifference / daysSinceStart
    setTotalApy(dailyTotalPercentage * 365 + 0.1)
  }

  const totalReceivedVRN = receivedVRNManual / 1000000000000000000

  return (
    <>
      <AppBody>
        <AutoColumn gap={'12px'}>
          <RowBetween>
            <Title>{t('stakeGovernance')}</Title>
          </RowBetween>
        </AutoColumn>

        <UserBalance>
          <AutoColumn gap={'12px'} style={{ width: '100%' }}>
            <RowBetween>
              <Text>{t('stakeDisabled')}</Text>
            </RowBetween>
          </AutoColumn>
        </UserBalance>
        {account ? (
          <>
            <UserBalance>
              <AutoColumn gap={'12px'} style={{ width: '100%' }}>
                <RowBetween style={{ marginTop: '24px' }}>
                  <Title>{t('stakeGovernanceUnstake')}</Title>
                  <Question text={t('stakeGovernanceUnstakeDescription')} />
                </RowBetween>
                <RowBetween>
                  <Text>{t('yourCurrencyBalance', { currencySymbol: yVRN.name })}:</Text>
                  {fetchingUserBalances ? (
                    <Loader />
                  ) : (
                    <BalanceText>
                      {numberToSignificant(Number(userBalances[yVRN.address]?.toSignificant(18)) * yvrnPrice, 4) +
                        ' ' +
                        VRN.symbol}
                      <br />
                      {userBalances[yVRN.address]?.toSignificant(4) + ' ' + yVRN.symbol}
                      <br />({numberToUsd(Number(userBalances[yVRN.address]?.toSignificant(8)) * yvrnPriceUsd)})
                    </BalanceText>
                  )}
                </RowBetween>
                {hasYVrn && (
                  <RowBetween>
                    <Text>{t('stakeGovernanceUnstakeFee')}:</Text>
                    {!feeCountdownFetched ? (
                      <Loader />
                    ) : feeCountdown > now ? (
                      <BalanceText>
                        0.5% <br />
                        <Countdown
                          ends={feeCountdown}
                          format="DD[d] HH[h] mm[m] ss[s]"
                          string="setToZeroPercentIn"
                          endedString="stakeGovernanceNoFee"
                        />
                      </BalanceText>
                    ) : (
                      <Text>0%</Text>
                    )}
                  </RowBetween>
                )}
                {hasYVrn && (
                  <RowBetween>
                    <ButtonSecondary as={Link} width="100%" to="/unstake/single/gov">
                      {t('unstake')}
                    </ButtonSecondary>
                  </RowBetween>
                )}
              </AutoColumn>
            </UserBalance>
          </>
        ) : (
          <ButtonSecondary onClick={toggleWalletModal}>{t('connectWallet')}</ButtonSecondary>
        )}
      </AppBody>
    </>
  )
}
