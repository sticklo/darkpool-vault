/** @jsxImportSource frog/jsx */

import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'

export const app = new Frog({
  title: 'DarkPool',
})

app.frame('/', (c) => {
  return c.res({
    image: 'https://placehold.co/1200x630/1a1a2e/white?text=DarkPool+Vault+%7C+$10+Deposited',
    intents: [
      <Button.Link href="https://base-sepolia.blockscout.com/address/0xB85b0BA54C50738AB362A7947C94DFf20660dD7d">
        View Contract
      </Button.Link>,
    ],
  })
})

if (typeof caches === 'undefined') {
  devtools(app, { serveStatic })
}

export default app