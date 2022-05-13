import React, { Suspense } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter'
import Header from '../components/Header'
import Web3ReactManager from '../components/Web3ReactManager'
import ThemeQueryParamReader from '../theme/ThemeQueryParamReader'
import Buy from './Buy'
import Pool from './Pool'
import PoolFinder from './PoolFinder'
import RemoveLiquidity from './RemoveLiquidity'

import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects'
import StakeOverview from './Stake'
import { RedirectGovStake, RedirectToStake, RedirectToStakeWithParam } from './Stake/redirects'
import Navigation from '../components/Navigation'
import Popups from '../components/Popups'
import StakeGovernance from './Stake/Governance'
import { useGetTheme } from '../state/user/hooks'

const AppWrapper = styled.div<{ currentTheme: string }>`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  height: 100%;
  min-height: calc(100vh - 220px);
  padding-bottom: 40px;
  background: ${({ theme }) => theme.layerBG};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    background: ${({ theme }) => theme.layerBGTablet};
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    background: ${({ theme }) => theme.layerBGMobile};
  `};
  ${({ currentTheme }) => currentTheme === 'default' && 'background: transparent !important;'};
`

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
  z-index: 2;
  position: relative;
`

const BodyWrapper = styled.div`
  min-height: calc(100vh - 220px);
  display: flex;
  flex-direction: column;
  width: calc(100% - 300px);
  padding-top: 70px;
  align-items: center;
  box-sizing: content-box;
  flex: 1;
  z-index: 3;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
    z-index: 1;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0 0 16px;
  `};
`

const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: -320px;
  right: 0;
  pointer-events: none;
  max-width: 200vw !important;
  height: 100vw;
  position: absolute;
  z-index: 1;
  background: ${({ theme }) => theme.layerBG};
  transform: translateY(-50vw);
  ${({ theme }) => theme.mediaWidth.upToMedium`
    left: 0;
  `};
`
const BackgroundImage = styled.div`
  position: absolute;
  height: 100%;
  width: 100vw;
  background-position: 0 200px;
  background-size: calc(50vw - 380px) auto;
  background-repeat: no-repeat;
  background-image: url('../images/themes/default/bg.svg');
  z-index: 2;
  opacity: 0.05;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`

export default function App() {
  const currentTheme = useGetTheme()

  return (
    <Suspense fallback={null}>
      <HashRouter>
        <Route component={GoogleAnalyticsReporter} />
        <Route component={ThemeQueryParamReader} />
        <AppWrapper currentTheme={currentTheme}>
          {currentTheme === 'default' && (
            <>
              <BackgroundGradient />
              <BackgroundImage />
            </>
          )}
          <HeaderWrapper>
            <Header />
          </HeaderWrapper>
          <Navigation />
          <BodyWrapper>
            <Popups />
            <Web3ReactManager>
              <Switch>
                <Route exact strict path="/buy" component={Buy} />
                <Route exact strict path="/find" component={PoolFinder} />
                <Route exact strict path="/pool" component={Pool} />
                <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
                <Route exact path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
                <Route exact strict path="/stake" component={StakeOverview} />
                <Route exact strict path="/unstake" component={StakeOverview} />
                <Route exact path="/stake/gov" component={StakeGovernance} />
                <Route exact path="/stake/:param" component={RedirectToStakeWithParam} />
                <Route exact path="/stake/:currencyIdA/:currencyIdB" component={RedirectToStake} />
                <Route component={RedirectGovStake} />
              </Switch>
            </Web3ReactManager>
          </BodyWrapper>
        </AppWrapper>
      </HashRouter>
    </Suspense>
  )
}
