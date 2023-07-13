export const getIsInjected = () => Boolean(window.ethereum)

const InjectedWalletTable: {
  [key in keyof NonNullable<Window['ethereum']>]?: {
    name: string
    icon: string
  }
} = {
  isBraveWallet: { name: 'Brave', icon: 'brave-icon' },
  isRabby: { name: 'Rabby', icon: 'rabby-icon' },
  isTrust: { name: 'Trust Wallet', icon: 'trustwallet-icon' },
  isLedgerConnect: { name: 'Ledger', icon: 'ledger-icon' },
}

/**
 * Checks the window object for the presence of a known injectors and returns the most relevant injector name and icon.
 * Returns a default metamask installation object if no wallet is detected.
 *
 * @param isDarkMode - optional parameter to determine which color mode of the
 */
export function getInjection(isDarkMode?: boolean): {
  name: string
  icon: string
} {
  for (const [key, wallet] of Object.entries(InjectedWalletTable)) {
    if (window.ethereum?.[key as keyof Window['ethereum']]) return wallet
  }

  // Phantom sets its flag in a different part of the window object
  if (window.phantom?.ethereum?.isPhantom)
    return { name: 'Phantom', icon: 'phantom-icon' }

  // Check for MetaMask last, as other injectors will also set this flag, i.e. Brave browser and Phantom wallet
  if (window.ethereum?.isMetaMask) return { name: 'MetaMask', icon: 'metamask' }

  // Prompt metamask installation when there is no injection present or the only injection detected is coinbase (CB has separate entry point in UI)
  if (!window.ethereum || window.ethereum.isCoinbaseWallet)
    return { name: 'Install MetaMask', icon: 'metamask' }

  // Use a generic icon when injection is present but no known non-coinbase wallet is detected
  return {
    name: 'Browser Wallet',
    icon: isDarkMode ? 'browser-wallet-dark' : 'browser-wallet-light',
  }
}

/**
 * Returns true if `isMetaMask` is set to true and another non-metamask injector cannot be detected.
 */
export const getIsMetaMaskWallet = () => getInjection().name === 'MetaMask'

export const getIsCoinbaseWallet = () =>
  Boolean(window.ethereum?.isCoinbaseWallet)
