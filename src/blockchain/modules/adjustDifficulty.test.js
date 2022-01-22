import adjustDifficulty from "./adjustDifficulty";

describe('adjustDifficulty()', () => {
    let block

    beforeEach(() => {
        block = { timestamp: Date.now(), difficulty: 3}
    })

    it('Lowers the difficulty for slowly mined blocks', () => {
        expect(adjustDifficulty(block, block.timestamp + 6000)).toEqual(block.difficulty - 1)
    })

    it('Increased the difficulty for quick mined blocks', () => {
        expect(adjustDifficulty(block, block.timestamp + 1000)).toEqual(block.difficulty + 1)
    })
})