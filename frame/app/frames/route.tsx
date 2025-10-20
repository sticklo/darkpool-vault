import { Button } from "frames.js/next";
import { frames } from "./frames";

const handleRequest = frames(async (ctx) => {
  return {
    image: (
      <div tw="flex flex-col w-full h-full bg-slate-900 text-white items-center justify-center">
        <div tw="text-6xl font-bold mb-4">DarkPool Vault</div>
        <div tw="text-2xl mb-2">Total Deposited: $10.00</div>
        <div tw="text-2xl">Total Users: 1</div>
      </div>
    ),
    buttons: [
      <Button action="post">Deposit</Button>,
      <Button 
        action="link" 
        target="https://base-sepolia.blockscout.com/address/0xB85b0BA54C50738AB362A7947C94DFf20660dD7d"
      >
        View Contract
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;