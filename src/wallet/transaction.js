import { v1 as uuidV1} from 'uuid'
import { elliptic } from '../modules'

const REWARD = 1

class Transaction {
    constructor(){
        this.id = uuidV1()
        this.input = null
        this.outputs = []
    }

    static create(senderWallet, recipienAdress, amount) {
        const { balance, publicKey } = senderWallet

        if (amount > balance) throw Error(`Amount: ${amount} exceeds balance`)

        const transaction =  new Transaction()
        transaction.outputs.push(...[
            { amount: balance - amount, address: publicKey },
            { amount, address: recipienAdress }
        ])

        transaction.input = Transaction.sign(transaction, senderWallet)

        return transaction

    }

    static reward(mineWallet, blockchainWallet) {
        return this.create(blockchainWallet, mineWallet.publicKey, REWARD)
    }

    static vefiry(transaction) {
        const {input: {address, signature}, outputs} = transaction
        return elliptic.verifySignature(address, signature, outputs)
    }

    static sign(transaction, senderWallet) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(transaction.outputs)
        }
    }

    update(senderWallet, recipienAdress, amount) {
        const senderOutPut = this.outputs.find((output) => output.address === senderWallet.publicKey)

        if (amount > senderOutPut.amount) throw Error(`Amount: ${amount} Exceeds balance`)

        senderOutPut.amount -= amount
        this.outputs.push({amount, address: recipienAdress})
        this.input = Transaction.sign(this, senderWallet)

        return this
    }
}

export { REWARD }

export default Transaction