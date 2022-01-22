import PKG from './package.json'
import Block from './src/blockchain/block'

const {name, version} = PKG

console.log(`${name} v${version}`);
const {genesis} = Block
console.log(genesis.toString());

const block_1 = Block.mine(genesis, 'data-1')
console.log(block_1.toString());

const block_2 = Block.mine(block_1, 'data-2')
console.log(block_2.toString());