import Block from "./block";
import Blockchain from "./blockchain";

describe('Blockchain', () => {
    let blockchain
    let blockchainB

    beforeEach(() => {
        blockchain= new Blockchain()
        blockchainB= new Blockchain()
    })

    it('every blockchain has a genesis blockchain', () => {
        const [genesisBlock] = blockchain.blocks

        expect(genesisBlock).toEqual(Block.genesis)
        expect(blockchain.blocks.length).toEqual(1)
    })

    it('use addBlock()', () => {
        const data = 'd4t4'
        blockchain.addBlock(data)

        const [, lastBlock] = blockchain.blocks

        expect(lastBlock.data).toEqual(data)
        expect(blockchain.blocks.length).toEqual(2)
    })

    it('replace the chain with a valid chain', () => {
        blockchainB.addBlock('block-1')

        blockchain.replace(blockchainB.blocks)

        expect(blockchain.blocks).toEqual(blockchainB.blocks)
    })

    it('does nor replace the chain with one with less blocks', () => {
        blockchain.addBlock('block-1')

        expect(() => {
            blockchain.replace(blockchainB.blocks)
        }).toThrowError('Recieved chain is not longer tahn current chain')
    })

    it('not replace the chain with one is not valid', () => {
        blockchainB.addBlock('block-1')
        blockchainB.blocks[1].data = 'bl0ck-h4ck'

        expect(() => {
            blockchain.replace(blockchainB.blocks)
        }).toThrowError('Recieved chain is invalid')
    })
})