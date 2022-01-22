import Block, { DIFFICULTY } from "./block";

describe('Block', () => {
    let timestamp
    let previousBlock
    let hash
    let data
    let nonce


    beforeEach(() => {
        timestamp = new Date(2020,0,1)
        previousBlock = Block.genesis
        data = 't3st-d4t4'
        hash = 'h4sh'
        nonce = 128
    })

    it('create an instance with parameters', () => {
        const block = new Block(timestamp, previousBlock.hash, hash, data, nonce)

        expect(block.timestamp).toEqual(timestamp)
        expect(block.previousHash).toEqual(previousBlock.hash)
        expect(block.data).toEqual(data)
        expect(block.hash).toEqual(hash)
        expect(block.nonce).toEqual(nonce)
    })

    it('use static mine', () => {
        const block = Block.mine(previousBlock,data)
        const { difficulty } = block

        expect(block.hash.length).toEqual(64)
        expect(block.hash.substring(0,difficulty)).toEqual('0'.repeat(difficulty))
        expect(block.previousHash).toEqual(previousBlock.hash)
        expect(block.nonce).not.toEqual(0)
        expect(block.data).toEqual(data)
    })

    it('use static hash()', () => {
        hash = Block.hash(timestamp, previousBlock.hash, data, nonce)
        const hashUotput = 'cb915de4ce610f12bd50da6121169eade06e86964a20805a125f0c67360deca5'

        expect(hash).toEqual(hashUotput)
    })

    it('use toString()', () => {
        const block = Block.mine(previousBlock, data)

        expect(typeof block.toString()).toEqual('string')
    })
})