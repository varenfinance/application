import React, { useState } from 'react'
import styled from 'styled-components'
import { Globe, PlusSquare, MinusSquare, Menu, X } from 'react-feather'
import { Settings } from 'react-feather'
import { SwapSVG, PoolSVG, StakeSVG, BuySVG, VRNSVG, WalletSVG, ThemeSVG } from '../SVG'
import { NavLink } from 'react-router-dom'
import { useNavigationActiveItem } from '../../state/navigation/hooks'
import { RowBetween } from '../Row'
import Theme from '../Theme'
import Language from '../Language'
import SettingsTab from '../Settings'
import Web3Status from '../Web3Status'
import Gas from '../Gas'
import { useActiveWeb3React } from '../../hooks'
import { useETHBalances, useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { Text } from 'rebass'
import { ChainId } from '@uniswap/sdk'
import { useExpertModeManager } from '../../state/user/hooks'
import { AutoColumn } from '../Column'
import { LINK, VRN, yVRN } from '../../constants'
import Loader from '../Loader'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { displayNumber } from '../../utils/numberUtils'

const NavigationWrapper = styled.nav<{ active?: boolean }>`
  height: 100vh;
  position: fixed;
  top: 0;
  right: -20px;
  width: 320px;
  display: flex;
  flex: 0 0 320px;
  flex-direction: column;
  flex-wrap: wrap;
  background: ${({ theme }) => theme.appBGColor};
  border-left: 1px solid ${({ theme }) => theme.modalBorder};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  overflow-x: hidden;
  overflow-y: scroll;
  box-sizing: content-box;
  z-index: 4;

  [dir='rtl'] & {
    right: unset;
    left: -20px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    right: 0;
    [dir='rtl'] & {
      right: unset;
      left: 0;
    }
    width: 100%;
    height: 100%;
    flex: 0 0 100%;
  `};

  @media (max-width: 960px) {
    display: ${({ active }) => (active ? 'block' : 'none')};
  }
`

const NavigationIconWrapper = styled.div`
  width: 26px;
  height: 26px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-inline-end: 10px;

  & svg {
    height: 18px;
    width: auto;
    fill: ${({ theme }) => theme.textPrimary};
  }
`

const LanguageIcon = styled(Globe)`
  color: ${({ theme }) => theme.textPrimary};
  height: 16px;
  width: auto;
  fill: transparent !important;
`

const NavigationBody = styled.ul`
  width: 100%;
  margin: 0;
  padding: 1rem;
  padding-inline-end: 2rem;
  list-style: none;
  display: block;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100vw;
    padding: 1rem;
  `};
`

const SubNavigationBody = styled.div<{ show?: boolean }>`
  width: 100%;
  margin: 0.5rem 0 1rem;
  padding: 0;
  display: ${({ show }) => (show ? 'block' : 'none')};
  font-size: 14px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 16px;
  `};

  * {
    ::selection {
      background: transparent;
    }
  }
`

const SubNavigationBodyList = styled.ul<{ show?: boolean }>`
  width: 100%;
  margin: 0.5rem 0 0;
  padding: 0 0 0 36px;
  list-style: none;
  display: ${({ show }) => (show ? 'block' : 'none')};
  font-size: 14px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 16px;
  `};

  * {
    ::selection {
      background: transparent;
    }
  }
`

const NavigationElement = styled.li`
  width: 100%;
  display: flex;
  flex: 0 0 100%;
  padding: 0;
  margin: 0 0 0.5rem;
  flex-wrap: wrap;
  font-size: 16px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 0 0 1rem;
  `};
`

const SubNavigationElement = styled.li`
  width: 100%;
  display: flex;
  flex: 0 0 100%;
  padding: 0;
  margin: 0 0 0.5rem;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 0 0 1rem;
  `};
  & * {
    color: ${({ theme }) => theme.textSecondary};
  }
`
const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  width: 100%;
  display: block;
  text-decoration: none;

  &.${activeClassName} {
    font-weight: bold;
    pointer-events: none;
  }

  &:hover {
    text-decoration: underline;
  }
`
const ExternalNavLink = styled.a`
  width: 100%;
  display: block;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`
const NavTitle = styled.div<{ active?: boolean }>`
  width: 100%;
  display: flex;
  flex: 0 0 100%;
  flex-wrap: nowrap;
  align-items: center;
  font-weight: ${({ active }) => (active ? '700' : 'normal')};
  text-transform: uppercase;
  position: relative;
  z-index: 1;
`
const NavTitleLink = styled.span`
  display: flex;
  flex: 1;
  flex-wrap: nowrap;
  align-items: center;

  ::selection {
    background: transparent;
  }

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`

const NavLabel = styled.span`
  width: 100%;
  display: flex;
  flex: 0 0 100%;
  flex-wrap: nowrap;
  align-items: center;
`
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: 'Ethereum Mainnet',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.KOVAN]: 'Kovan'
}

const SettingsIconTop = styled(Settings)`
  height: 15px !important;
  width: 15px !important;
  position: absolute;
  left: 0;
  top: 3px;

  > * {
    fill: transparent !important;
    stroke: ${({ theme }) => theme.textPrimary};
  }
`
const SettingsIconBottom = styled(Settings)`
  height: 13px !important;
  width: 13px !important;
  position: absolute;
  right: 2px;
  bottom: 1px;

  > * {
    fill: transparent !important;
    stroke: ${({ theme }) => theme.textPrimary};
  }
`

const SettingsIcon = styled(Settings)`
  color: ${({ theme }) => theme.textPrimary};
  height: 16px;
  width: auto;
  fill: transparent !important;
`

const BalanceText = styled.p`
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const CollapseToggle = styled.div`
  height: 26px;
  width: 23px;
  padding: 3px 0 3px 3px;
  display: block;
  position: absolute;
  right: 0;
  z-index: 2;

  &:hover {
    cursor: pointer;

    & > * {
      color: ${({ theme }) => theme.textHighlight};

      ${({ theme }) => theme.mediaWidth.upToSmall`
        color: ${({ theme }) => theme.textPrimary};
      `};
    }
  }

  [dir='rtl'] & {
    right: unset;
    left: 0;
    padding: 3px 3px 3px 0;
  }
`

const ExpandIcon = styled(PlusSquare)`
  color: ${({ theme }) => theme.textPrimary};
  height: 20px;
  width: auto;
  fill: transparent !important;
`

const CollapseIcon = styled(MinusSquare)`
  color: ${({ theme }) => theme.textPrimary};
  height: 20px;
  width: auto;
  fill: transparent !important;
`

const NavigationToggleInMenu = styled.div`
  width: 100%;
  height: 35px;
  margin: 0;
  padding: 1rem 0 2rem;
  display: none;
  align-items: center;
  justify-content: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: flex;
  `};

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
  }
`
const NavigationToggle = styled.div`
  width: 32px;
  height: 35px;
  border: none;
  margin: 0;
  padding: 0;
  background: ${({ theme }) => theme.headerButtonBG};
  padding: 2px 5px;
  border-radius: 0.5rem;
  display: none;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 2;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: flex;
  `};

  :hover {
    cursor: pointer;
    outline: none;
    background: ${({ theme }) => theme.headerButtonBGHover};
  }
`

const NavigationCloseIcon = styled(X)`
  height: 22px;
  width: 22px;

  > * {
    stroke: ${({ theme }) => theme.headerButtonIconColor};
  }
`

const NavigationIcon = styled(Menu)`
  height: 22px;
  width: 22px;

  > * {
    stroke: ${({ theme }) => theme.headerButtonIconColor};
  }
`

export default function Navigation() {
  const { account, chainId } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const active = useNavigationActiveItem()
  const currentActive = active.split('-')[0]
  const [oldPage, setOldPage] = useState('swap')
  const [showMenu, setShowMenu] = useState(false)
  const [showWallet, setShowWallet] = useState(true)
  const [showStaking, setShowStaking] = useState(false)
  const [showVaren, setShowVaren] = useState(false)
  const [showThemes, setShowThemes] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)
  const [userBalances, fetchingUserBalances] = useTokenBalancesWithLoadingIndicator(account ?? undefined, [VRN, yVRN])
  const { t } = useTranslation()
  const history = useHistory()
  const goTo = (path: string) => {
    history.push(path)
  }

  if (oldPage !== active) {
    setOldPage(active)
    setShowMenu(false)
  }

  switch (currentActive) {
    case 'stake':
      if (!showStaking) {
        setShowStaking(true)
        setShowVaren(false)
      }
      break
    default:
      if (showStaking) {
        setShowStaking(false)
      }
  }

  return (
    <>
      <NavigationToggle
        onClick={() => {
          setShowMenu(!showMenu)
        }}
      >
        {showMenu ? <NavigationCloseIcon /> : <NavigationIcon />}
      </NavigationToggle>
      <NavigationWrapper active={showMenu}>
        <NavigationBody>
          <NavigationToggleInMenu
            onClick={() => {
              setShowMenu(!showMenu)
            }}
          >
            {showMenu ? <NavigationCloseIcon /> : <NavigationIcon />}
          </NavigationToggleInMenu>
          <NavigationElement>
            <NavTitle>
              <NavTitleLink
                onClick={() => {
                  setShowWallet(!showWallet)
                }}
              >
                <NavigationIconWrapper>
                  <WalletSVG />
                </NavigationIconWrapper>
                {t('wallet')}
              </NavTitleLink>
              <CollapseToggle
                onClick={() => {
                  setShowWallet(!showWallet)
                }}
              >
                {showWallet ? <CollapseIcon /> : <ExpandIcon />}
              </CollapseToggle>
            </NavTitle>
            <SubNavigationBody show={showWallet}>
              {account ? (
                <AutoColumn gap="8px">
                  <Web3Status />
                  {chainId && NETWORK_LABELS[chainId] && (
                    <RowBetween>
                      <Text>{t('network')}:</Text>
                      <Text>{NETWORK_LABELS[chainId]}</Text>
                    </RowBetween>
                  )}
                  <RowBetween>
                    <Gas />
                  </RowBetween>
                  <RowBetween>
                    <Text fontWeight={700}>Balances</Text>
                  </RowBetween>
                  {userEthBalance && (
                    <RowBetween>
                      <Text>Ethereum:</Text>
                      <Text>{displayNumber(userEthBalance?.toSignificant(6))} ETH</Text>
                    </RowBetween>
                  )}
                  {userBalances && (
                    <>
                      <RowBetween>
                        <Text>{VRN.name}:</Text>
                        {fetchingUserBalances ? (
                          <Loader />
                        ) : (
                          <BalanceText>
                            {displayNumber(userBalances[VRN.address]?.toSignificant(6)) + ' ' + VRN.symbol}
                          </BalanceText>
                        )}
                      </RowBetween>
                    </>
                  )}
                  {userBalances && (
                    <>
                      <RowBetween>
                        <Text>{yVRN.name}:</Text>
                        {fetchingUserBalances ? (
                          <Loader />
                        ) : (
                          <BalanceText>
                            {displayNumber(userBalances[yVRN.address]?.toSignificant(6)) + ' ' + yVRN.symbol}
                          </BalanceText>
                        )}
                      </RowBetween>
                    </>
                  )}
                </AutoColumn>
              ) : (
                <AutoColumn gap="8px">
                  <Web3Status />
                  <RowBetween>
                    <Gas />
                  </RowBetween>
                </AutoColumn>
              )}
            </SubNavigationBody>
          </NavigationElement>
          <NavigationElement>
            <NavTitle active={currentActive === 'stake'}>
              <NavTitleLink
                onClick={() => {
                  goTo('/stake')
                  if (!showStaking) {
                    setShowStaking(true)
                  }
                }}
              >
                <NavigationIconWrapper>
                  <StakeSVG />
                </NavigationIconWrapper>
                {t('staking')}
              </NavTitleLink>
              {currentActive !== 'stake' && (
                <CollapseToggle
                  onClick={() => {
                    setShowStaking(!showStaking)
                  }}
                >
                  {showStaking ? <CollapseIcon /> : <ExpandIcon />}
                </CollapseToggle>
              )}
            </NavTitle>
            <SubNavigationBodyList show={showStaking}>
              <SubNavigationElement>
                <StyledNavLink id={'stake'} to={'/stake'} isActive={() => active === 'stake'}>
                  <NavLabel>{t('allPools')}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink id={'stake'} to={'/stake/gov'} isActive={() => active === 'stake-governance'}>
                  <NavLabel>{t('stakeGovernance')}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink id={'stake-yours'} to={'/stake/yours'} isActive={() => active === 'stake-yours'}>
                  <NavLabel>{t('myPositions')}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <StyledNavLink
                  id={'stake-inactive'}
                  to={'/stake/inactive'}
                  isActive={() => active === 'stake-inactive'}
                >
                  <NavLabel>{t('inactivePools')}</NavLabel>
                </StyledNavLink>
              </SubNavigationElement>
            </SubNavigationBodyList>
          </NavigationElement>
          <NavigationElement>
            <NavTitle>
              <NavTitleLink
                onClick={() => {
                  setShowVaren(!showVaren)
                }}
              >
                <NavigationIconWrapper>
                  <VRNSVG />
                </NavigationIconWrapper>
                Varen Finance
              </NavTitleLink>
              <CollapseToggle
                onClick={() => {
                  setShowVaren(!showVaren)
                }}
              >
                {showVaren ? <CollapseIcon /> : <ExpandIcon />}
              </CollapseToggle>
            </NavTitle>
            <SubNavigationBodyList show={showVaren}>
              <SubNavigationElement>
                <ExternalNavLink href="https://discord.varen.finance">
                  <NavLabel>Discord</NavLabel>
                </ExternalNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <ExternalNavLink href="https://twitter.varen.finance">
                  <NavLabel>Twitter</NavLabel>
                </ExternalNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <ExternalNavLink href="https://telegram.varen.finance">
                  <NavLabel>Telegram</NavLabel>
                </ExternalNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <ExternalNavLink href="https://blog.varen.finance">
                  <NavLabel>Blog</NavLabel>
                </ExternalNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <ExternalNavLink href="https://github.varen.finance">
                  <NavLabel>Github</NavLabel>
                </ExternalNavLink>
              </SubNavigationElement>
              <SubNavigationElement>
                <ExternalNavLink href="https://snapshot.varen.finance">
                  <NavLabel>{t('stakeGovernanceVoting')}</NavLabel>
                </ExternalNavLink>
              </SubNavigationElement>
            </SubNavigationBodyList>
          </NavigationElement>
          <NavigationElement>
            <NavTitle>
              <NavTitleLink
                onClick={() => {
                  setShowThemes(!showThemes)
                }}
              >
                <NavigationIconWrapper>
                  <ThemeSVG />
                </NavigationIconWrapper>
                {t('themes')}
              </NavTitleLink>
              <CollapseToggle
                onClick={() => {
                  setShowThemes(!showThemes)
                }}
              >
                {showThemes ? <CollapseIcon /> : <ExpandIcon />}
              </CollapseToggle>
            </NavTitle>
            <SubNavigationBody show={showThemes}>
              <Theme />
            </SubNavigationBody>
          </NavigationElement>
          <NavigationElement>
            <NavTitle>
              <NavTitleLink
                onClick={() => {
                  setShowLanguages(!showLanguages)
                }}
              >
                <NavigationIconWrapper>
                  <LanguageIcon />
                </NavigationIconWrapper>
                {t('languages')}
              </NavTitleLink>
              <CollapseToggle
                onClick={() => {
                  setShowLanguages(!showLanguages)
                }}
              >
                {showLanguages ? <CollapseIcon /> : <ExpandIcon />}
              </CollapseToggle>
            </NavTitle>
            <SubNavigationBody show={showLanguages}>
              <Language />
            </SubNavigationBody>
          </NavigationElement>
        </NavigationBody>
      </NavigationWrapper>
    </>
  )
}
