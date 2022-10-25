import { ConnectWallet, useAddress, useContract, useTotalCirculatingSupply, Web3Button, useTotalCount, useActiveClaimCondition, useContractMetadata } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { GOTO_ADDRESS } from "../const/gopoAddress";
import { useState } from "react";
import styles from "../styles/Theme.module.css";
import { formatUnits, parseUnits } from "ethers/lib/utils";

const Home: NextPage = () => {
  const address= useAddress();

  const { contract:gocontract } = useContract(GOTO_ADDRESS);
  console.log(gocontract);
  
  const { data: totalCirculatingSupply } = useTotalCirculatingSupply(gocontract,0);
  console.log(totalCirculatingSupply);

  const { data: count } = useTotalCount(gocontract);
  console.log(count);
  const { data: activeClaimCondition } = useActiveClaimCondition(gocontract);

  const { data: contractMetadata } = useContractMetadata(gocontract);


  const [quantity, setQuantity] = useState(1);
  
 //check price
  const price = parseUnits(
    activeClaimCondition?.currencyMetadata.displayValue || "0",
    activeClaimCondition?.currencyMetadata.decimals
  );
 // Multiply depending on quantity
  const priceToMint = price.mul(quantity);
   // Check if there's any NFTs left
   const isSoldOut = activeClaimCondition?.currentMintSupply === activeClaimCondition?. maxQuantity;
   // Check if there's NFTs left on the active claim phase
  const isNotReady =
  activeClaimCondition &&
  parseInt(activeClaimCondition?.availableSupply) === 0;

  
return (

 <div style={{maxWidth: 200 }} >
  <ConnectWallet  >
   
  </ConnectWallet>


  <div className={styles.container}>
  <div className={styles.imageSide}>
          {/* Image Preview of NFTs */}
          <img
            className={styles.image}
            src={contractMetadata?.image}
            alt={`${contractMetadata?.name} preview image`}
          />
    
  <div className={styles.mintCompletionArea}>
  

   
<div className={styles.mintAreaLeft}>



    <p>Total Minted:  </p>

      {activeClaimCondition && activeClaimCondition ? (
       <p>
       {/* Claimed supply so far */}
       <b>{activeClaimCondition?.currentMintSupply}</b>
          {" / "}
          {
          // Add unclaimed and claimed supply to get the total supply
            activeClaimCondition?. maxQuantity
           }
           </p>):(
                // Show loading state if we're still loading the supply
                <p>Loading...</p>
              )}
</div>
</div>


          {/* Show claim button or connect wallet button */}
          {
            // Sold out or show the claim button
            isSoldOut ? (
              <div>
                <h2>Sold Out</h2>
              </div>
            ) : isNotReady ? (
              <div>
                <h2>Not ready to be minted yet</h2>
              </div>
            ) : (
              <>

                <div className={styles.quantityContainer}>
                  <button
                  className={`${styles.quantityControlButton}`}
                    onClick={() => setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>

                  <h4>{quantity}</h4>

                  <button
                  className={`${styles.quantityControlButton}`}
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={
                      quantity >=
                      parseInt(
                        activeClaimCondition?.quantityLimitPerTransaction || "0"
                      )
                    }
                  >
                    +
                  </button>
                </div>
     <Web3Button
  contractAddress={GOTO_ADDRESS}
  action={(contract) => contract.erc721.claimTo(address!, quantity)}
   // If the function is successful, we can do something here.
   onSuccess={(result) =>
    alert(
      `Successfully minted ${result.length} NFT${
        result.length > 1 ? "s" : ""
      }!`
    )
  }
  // If the function fails, we can do something here.
  onError={(error) => alert(error?.message)}
  
  >
  {`Mint${quantity > 1 ? ` ${quantity}` : ""}${
                      activeClaimCondition?.price.eq(0)
                        ? " (Free)"
                        : activeClaimCondition?.currencyMetadata.displayValue
                        ? ` (${formatUnits(
                            priceToMint,
                            activeClaimCondition.currencyMetadata.decimals
                          )} ${activeClaimCondition?.currencyMetadata.symbol})`
                        : ""
                    }`}

 </Web3Button>
 </>)}

    </div>
    </div>
   </div>
    
  );
};

export default Home;
