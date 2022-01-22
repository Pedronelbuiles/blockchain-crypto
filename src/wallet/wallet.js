import Transaction from './transaction'
import { elliptic, hash } from '../modules'

const INITIAL_BALANCE = 100

class Wallet {
    constructor(blockChain, initialBalance = INITIAL_BALANCE) {
        this.balance = initialBalance
        this.keyPair = elliptic.createKeyPair()
        this.publicKey = this.keyPair.getPublic().encode('hex')
        this.blockChain = blockChain
    }

    toString() {
        const { balance, publicKey } = this
        return `wallet - 
            publicKey   :${publicKey.toString()}
            balance     :${balance}
        `
    }

    sign(data) {
        return this.keyPair.sign(hash(data))
    }

    createTransaction(recipientAdress, amount) {
        const {currentBalance, blockChain: {memoryPool}} = this

        if(amount > currentBalance) throw Error(`About: ${amount} exceds current balance`)

        let tx = memoryPool.find(this.publicKey)
        if (tx) {
            tx.update(this, recipientAdress, amount)
        } else {
            tx = Transaction.create(this, recipientAdress, amount)
            memoryPool.addOrUpdate(tx)
        }

        return tx
    }

    get currentBalance() {
        const {blockChain:{ blocks = []}, publicKey} = this
        let {balance} = this
        const txs = []

        blocks.forEach(({data = []}) => {
            if(Array.isArray(data)) data.forEach((tx) => txs.push(tx))
        });

        const walletInputs = txs.filter((tx) => tx.input.address === publicKey)
        let timestamp = 0

        if (walletInputs.length > 0) {
            const recentInputTx = walletInputs
                .sort((a, b) => a.input.timestamp - b.input.timestamp )
                .pop()

            balance = recentInputTx.outputs.find(({address}) => address === publicKey).amount
            timestamp = recentInputTx.input.timestamp
        }

        txs
            .filter(({input}) => input.timestamp > timestamp)
            .forEach(({outputs}) => {
                outputs.forEach(({address, amount}) => {
                    if (address === publicKey) balance += amount
                })
            })
        
        return balance
    }
}

export { INITIAL_BALANCE }

export default Wallet