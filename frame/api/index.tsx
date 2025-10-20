import { Frog } from 'frog'

export const app = new Frog({
  title: 'DarkPool',
  basePath: '/api',
})

app.frame('/', (c) => {
  return c.res({
    image: 'https://placehold.co/1200x630/1a1a2e/white?text=DarkPool+Vault',
    intents: [
      <button action="/">Deposit</button>,
      <button action="https://base-sepolia.blockscout.com/address/0xB85b0BA54C50738AB362A7947C94DFf20660dD7d">View Contract</button>,
    ],
  })
})

export default app