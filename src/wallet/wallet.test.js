import Wallet, { INITIAL_BALANCE } from "./wallet";
import Blockchain from '../blockchain'

describe('Wallet ', () => {
    let blockChain
    let wallet

    beforeEach(() => {
        blockChain = new Blockchain()
        wallet = new Wallet(blockChain)
    })

    it('it is a healthy wallet', () => {
        expect(wallet.balance).toEqual(INITIAL_BALANCE)
        expect(typeof wallet.keyPair).toEqual('object')
        expect(typeof wallet.publicKey).toEqual('string')
        expect(wallet.publicKey.length).toEqual(130)
    })

    it('use sign()', () => {
        const signature = wallet.sign('h3ll0')
        expect(typeof signature).toEqual('object')
        expect(signature).toEqual(wallet.sign('h3ll0'))
    })

    describe('creating a transaction', () => {
        let tx
        let recipientAdress
        let amount

        beforeEach(() => {
            recipientAdress = 'r4nd0m-4ddr3ss'
            amount= 5
            tx = wallet.createTransaction(recipientAdress, amount)
        })

        describe('and doing the same transaction', () => {
            beforeEach(() => {
                tx = wallet.createTransaction(recipientAdress, amount)
            })

            it('double the amount subtracted from the wallet balance', () => {
                const output = tx.outputs.find(({address}) => address === wallet.publicKey)
                expect(output.amount).toEqual(wallet.balance - (amount * 2))
            })

            it('clones the amount output for the recipient', () => {
                const amounts = tx.outputs
                    .filter(({address}) => address === recipientAdress)
                    .map((output) => output.amount)
                
                expect(amounts).toEqual([amount,amount])
            })
        })
    })

    describe('calculating the current balance', () => {
        let addBalance
        let times
        let senderWallet

        beforeEach(() => {
            addBalance = 16
            times = 3
            senderWallet = new Wallet(blockChain)

            for (let i = 0; i < times; i++) {
                senderWallet.createTransaction(wallet.publicKey, addBalance)
            }

            blockChain.addBlock(blockChain.memoryPool.transactions)
        })

        it('calculates the balance for blockChain txs matching the recipient', () => {
            expect(wallet.currentBalance).toEqual(INITIAL_BALANCE + (addBalance * times))
        })

        it('calculates the balance for blockchain txs matching the sender', () => {
            expect(senderWallet.currentBalance).toEqual(INITIAL_BALANCE - (addBalance * times))
        })

        describe('and the recipient conducts a transaction', () => {
            let subtractBalance
            let recipientbalance

            beforeEach(() => {
                blockChain.memoryPool.wipe()
                subtractBalance = 64
                recipientbalance = wallet.currentBalance

                wallet.createTransaction(senderWallet.publicKey, addBalance)

                blockChain.addBlock(blockChain.memoryPool.transactions)
            })

            describe('and the sender sends another transaction to the recipient', () => {
                beforeEach(() => {
                    blockChain.memoryPool.wipe()

                    senderWallet.createTransaction(wallet.publicKey, addBalance)

                    blockChain.addBlock(blockChain.memoryPool.transactions)
                })

                it('calculate the recipient balance only using txs since its most recent one', () => {
                    expect(wallet.currentBalance).toEqual(recipientbalance - subtractBalance + addBalance)
                })
            })
        })
    })
})