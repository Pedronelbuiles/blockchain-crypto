import Block from "./block";
import validate from "./modules/validate";
import MemoryPool from "./memoryPool";

class Blockchain {
    constructor() {
        this.blocks = [Block.genesis]
        this.memoryPool = new MemoryPool()
    }

    addBlock(data){
        const previousBlock = this.blocks[this.blocks.length - 1]
        const block = Block.mine(previousBlock, data)

        this.blocks.push(block)

        return block
    }

    replace(newBlocks = []){
        if(newBlocks.length < this.blocks.length) throw Error('Recieved chain is not longer tahn current chain')
        try {
            validate(newBlocks)
        } catch (error) {
            throw Error('Recieved chain is invalid')
        }

        this.blocks = newBlocks
        
        return this.blocks
    }

}

export default Blockchain