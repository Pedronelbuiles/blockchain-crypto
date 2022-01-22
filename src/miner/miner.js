import { Transaction, blockchainWallet } from '../wallet'
import { MESSAGE } from '../service/p2p'

class Miner {
    constructor(blockChain, p2pService, wallet){
        this.blockChain = blockChain
        this.p2pService = p2pService
        this.wallet = wallet
    }

    mine() {
        const {blockChain: {memoryPool}, p2pService, wallet} = this

        if(memoryPool.transactions.length === 0) throw Error('There are no unconfirmed transactions.')

        memoryPool.transactions.push(Transaction.reward(wallet, blockchainWallet))
        const block = this.blockChain.addBlock(memoryPool.transactions)
        p2pService.sync()
        memoryPool.wipe()
        p2pService.broadcast(MESSAGE.WIPE)

        return block
    }
}

export default Miner