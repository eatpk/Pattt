const CryptoJS = require("crypto-js");

class Block{
  constructor(index, hash, previousHash, timestamp, data){
    this.index=index;
    this.hash=hash;
    this.previousHash=previousHash;
    this.timestamp=timestamp;
    this.data=data;
  }

}

const genesisBlock = new Block(0,
"804E9423DBABA27412063B781AFF04C88319719C5212998B004D36AEFB4A72A6",
null,
1526657657276,//hard-copied for the first genesisBlock
"This is genesis block"
);

let blockchain = (genesisBlock);

const getLastBlock = ()=> blockchain[blockchain.length-1];
/*Equivalent to:
function getLastBlock(){return blockchain[blockchain.length-1];}*/
const getTimestamp =()=> new Date().getTime/1000;
const getBlockchain = () =>  blockchain;
const createHash = (index,previousHash,timestamp,data)=> CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data)).toString();


const createNewBlock = (data) =>{
  const previousBlock = getLastBlock();
  const newBlockIndex = previousBlock.index + 1;
  const newTimestamp = getTimestamp();
  const newHash = createHash(newBlockIndex,previousBlock.hash,newTimestamp,data);
  const newBlock = new Block(
    newBlockIndex,
    newHash,
    previousBlock.hash,
    newTimestamp,
    data
  );
    addBlockToChain(newBlock);
  return newBlock;
};

const getBlocksHash = (block) => createHash(block.index, block.previousHash, block.timestamp, block.data);

const isNewBlockValid = (candidateBlock, latestBlock) =>{
  if (!isNewStructureValid(candidateBlock)){
    console.log("the candidate block structure isn't valid");
    return false;
  }
  else if(latestBlock.index+1 != candidateBlock.index){//first condition : index link
    console.log("Candidate block index invalid");
    return false;
  }
  else if(latestBlock.hash != candidateBlock.previousHash){//second condition: is hash same?
    console.log("the hash of candidate block does not match with the latest block");
    return false;
  }
  else if(getBlocksHash(candidateBlock)!=candidateBlock.hash){//calculate if the hash i calculated is same.
    console.log("the hash of this block is invalid");
    return false;
  }
  return true;
};

const isNewStructureValid = (block) =>{
  return(
    typeof block.index === "number"&&
    typeof block.hash === "string" &&
    typeof block.previousHash ==="string"&&
    typeof block.timestamp ==="number" &&
    typeof block.data ==="string"
  );
};

const isChainValid = (candidateChain) =>{
  const isGenesisValid = (block) =>{
    return JSON.stringify(block) === JSON.stringify(genesisBlock);
  };
  if(!isGenesisValid(candidateChain[0])){
    console.log("candidate block does not start from the original chain");
    return false;
  }
  for (let i=1; i<candidateChain.length; i++){
    if(!isNewBlockValid(candidateChain[i],candidateChain[i-1])){
      return false;
    }
  }
  return true;
};

const replaceChain = (newChain) =>{
  if (isChainValid(newChain) && newChain.length > getBlockchain().length){
    blockchain = newChain;
    return true;
  }else{
    return false;
  }
};

const addBlockToChain = (candidateBlock) => {
  if(isNewBlockValid(candidateBlock, getLastBlock())){
    getBlockchain().push(candidateBlock);
    return true;
  }else{
    return false;
  }
};

module.exports = {
  getBlockchain, createNewBlock
};