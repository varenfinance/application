export function drcTheme() {
  const mainColor = '#133b54'
  const mainColorHover = '#0c1c2f'
  const mainButtonColor = '#f74a68'
  const mainButtonColorHover = '#d84762'
  const appBG = 'rgba(0, 0, 0, 0.4)'
  const bodyBGColor = '#070a11'
  const inputBGColor = '#070a11'
  const mainTextColor = '#e0effe'
  const mainTextColorHover = '#FFF'
  const transparent = 'transparent'
  const buttonBG = '#181323'
  const buttonBGHover = '#1e1e27'
  const buttonSecondaryBG = '#1e1e27'
  const modalBG = '#0f1418'
  const infoText = '#0b090f'
  const infoBGHover = '#221b24'
  const highLights = '#f74a68'

  return {
    //App
    appBGColor: appBG,
    appInfoBoxBG: mainColor,
    appInfoBoxTextColor: mainButtonColorHover,
    appBoxBG: inputBGColor,
    appBoxBorder: '#373f49',
    appBoxHoverBG: '#373f49',
    appBoxHoverBorder: '#5e6373',
    appBoxTextColor: mainTextColor,
    appBoxSecondaryBG: buttonSecondaryBG,
    appBoxSecondaryTextColor: mainTextColor,
    appBoxSecondaryInnerBG: inputBGColor,
    appBoxSecondaryInnerTextColor: mainTextColor,
    appCurrencyInputBG: inputBGColor,
    appCurrencyInputTextColor: mainTextColor,
    appCurrencyInputBGHover: inputBGColor,
    appCurrencyInputTextColorHover: mainTextColor,
    appCurrencyInputBGActive: mainButtonColor,
    appCurrencyInputTextColorActive: mainTextColor,
    appCurrencyInputBGActiveHover: mainButtonColorHover,
    appCurrencyInputTextColorActiveHover: mainTextColor,

    //Buttons
    buttonBG: mainButtonColor,
    buttonTextColor: mainTextColor,
    buttonBGHover: mainButtonColorHover,
    buttonTextColorHover: mainTextColorHover,
    buttonBGActive: mainButtonColor,
    buttonTextColorActive: mainTextColor,
    buttonBGActiveHover: mainButtonColorHover,
    buttonTextColorActiveHover: mainTextColor,
    buttonBGDisabled: buttonBG,
    buttonTextColorDisabled: mainTextColor,
    buttonNavigationBG: buttonBG,
    buttonNavigationTextColor: mainTextColor,
    buttonNavigationBGHover: modalBG,
    buttonNavigationTextColorHover: mainTextColor,
    buttonSelectBG: buttonSecondaryBG,
    buttonSelectTextColor: mainTextColor,
    buttonSelectBGHover: buttonBGHover,
    buttonSelectTextColorHover: mainTextColor,
    buttonSelectBGActive: mainColor,
    buttonSelectTextColorActive: mainTextColor,
    buttonSelectBGActiveHover: mainColor,
    buttonSelectTextColorActiveHover: mainTextColor,
    buttonSecondaryBG: mainColor,
    buttonSecondaryBorder: transparent,
    buttonSecondaryTextColor: mainTextColor,
    buttonSecondaryBGActive: mainColor,
    buttonSecondaryBorderActive: mainColor,
    buttonSecondaryTextColorActive: mainTextColor,
    buttonSecondaryBGHover: mainColorHover,
    buttonSecondaryBorderHover: mainColorHover,
    buttonSecondaryTextColorHover: mainTextColor,
    buttonOutlinedBorder: mainColor,
    buttonOutlinedTextColor: mainTextColor,
    buttonOutlinedBorderHover: mainColorHover,
    buttonOutlinedTextColorHover: mainTextColor,

    //Footer
    footerBG: bodyBGColor,
    footerTextColor: mainButtonColor,

    //Global
    bodyBG: '#070a11 url("../images/themes/drc/background_large.jpg") bottom right / cover no-repeat',
    bodyBGTablet: '#070a11 url("../images/themes/drc/background_tablet.jpg") bottom right / cover no-repeat',
    bodyBGMobile: '#070a11 url("../images/themes/drc/background_mobile.jpg") bottom right / cover no-repeat',
    layerBG: transparent,
    layerBGTablet: transparent,
    layerBGMobile: transparent,
    bodyBGColor: bodyBGColor,
    borderRadius: '6px',
    linkColor: mainColor,
    linkColorHover: mainColor,
    lineColor: '#5F656D',
    logoFilter: 'none',
    logo:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQEAAAA8CAYAAABmfw86AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAzIDc5LjE2NDUyNywgMjAyMC8xMC8xNS0xNzo0ODozMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozYTRlNzQ1ZS1mOTE4LWZkNGMtOGEwZS1mNGFhZjEwZGQ3ZTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjgyNDEwM0E0OTM5MTFFQkE4RUVFQkE2RkNGNUQzQUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjgyNDEwMzk0OTM5MTFFQkE4RUVFQkE2RkNGNUQzQUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjEgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YzZmNDg4MTAtOTMyNS0zOTQzLWE3NTYtNDU2ZTUwODU3NmMyIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6NWY5MGQ0MGQtMjgyNS03MjQ1LTliMWYtNWEw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',

    //Header
    headerBG: transparent,
    headerTextColor: mainButtonColor,
    headerButtonBG: infoText,
    headerButtonBGHover: infoBGHover,
    headerButtonIconColor: mainButtonColor,
    headerModalTextColor: mainTextColor,
    headerModalTextHighlight: mainColor,

    //Modal
    modalBG: modalBG,
    modalBorder: appBG,
    modalSecondaryBG: bodyBGColor,
    modalLines: mainButtonColor,
    modalButtonBG: mainButtonColor,
    modalButtonText: mainTextColor,
    modalShadow: 'rgba(0, 0, 0, 0.4)',
    modalInputBG: transparent,
    modalInputBorder: mainButtonColor,
    modalInputBorderFocus: mainButtonColorHover,
    modalFooterBG: 'rgba(0, 0, 0, 0.4)',

    //Navigation
    navigationBG: appBG,
    navigationTabBG: transparent,
    navigationTabIconColor: mainTextColor,
    navigationTabBGHover: transparent,
    navigationTabIconColorHover: mainTextColor,
    navigationTabBGActive: mainButtonColor,
    navigationTabIconColorActive: mainTextColor,
    navigationTabModalBG: modalBG,
    navigationTabModalText: mainTextColor,
    navigationTabModalHover: mainColor,

    //Text
    textHighlight: highLights,
    textPrimary: mainTextColor,
    textSecondary: mainTextColor,
    textTertiary: '#bfbfbf',
    textDisabled: '#565A69',

    //States
    red1: '#FF6871',
    red2: '#F82D3A',
    green1: '#27AE60',
    yellow1: '#FFE270',
    yellow2: '#F3841E'
  }
}
