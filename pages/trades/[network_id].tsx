import React, {useEffect, useState} from 'react';
import DABU from '../../dabu/index';
import Web3 from 'web3';
var BN: any = Web3.utils.hexToNumberString;
import {useRouter} from 'next/router';
import {
  useAddress,
  MediaRenderer,
  useNetworkMismatch,
  useNetwork,
  ChainId,
} from '@thirdweb-dev/react';
//@ts-ignore
import SEO from '@/src/components/SEO';
// @ts-ignore
import Button from '@/src/components/Button';
// @ts-ignore
import getTrade from '@/src/hooks/getTrade';
// @ts-ignore
import ANIM_Ellipsis from '@/src/components/ANIM-Ellipsis';
function truncateAddress(address) {
  try {
    return `${address.substring(0, 6).toLowerCase()}...${address
      .substring(38, address.length)
      .toLowerCase()}`;
  } catch (error) {
    console.log(`truncateAddress(): ${error}`);
    return `truncateAddress(): ${error}`;
  }
}
export default function Dragon({connected}: any) {
  const router = useRouter();
  // De-construct network_id out of the router.query.
  // This means that if the user visits /listing/ethereum-0 then the network_id will be 0.
  // If the user visits /listing/1 then the network_id will be 1.
  const {network_id} = router.query as {network_id: string};
  const address = useAddress();
  var network;
  var listingId;
  if (network_id) {
    network = network_id.split('-')[0].toLowerCase();
    listingId = network_id.split('-')[1];
  }
  const {trade, isLoading} = getTrade({
    blockchain: network,
    listingId: listingId,
  });

  const [isError, setIsError] = useState<any>(false);
  // Ensure user is on the correct network
  const networkMismatch = useNetworkMismatch();

  const [, switchNetwork] = useNetwork();
  var dabu = new DABU();
  dabu.init();

  useEffect(() => {
    if (trade !== null) {
      if (typeof trade.error !== 'undefined') {
        setIsError(true);
      }
      console.log(trade);
      setIsError(false);
    }
  }, [trade]);
  if (isError) {
    return (
      <div className='h-100 d-flex flex-column justify-content-center align-items-center'>
        <h4>Trade Not Found</h4>
      </div>
    );
  }

  isLoading && (
    <div className='h-100 w-100 d-flex flex-row justify-content-center align-items-center'>
      <h4>
        Baking Cake
        <ANIM_Ellipsis />
      </h4>
    </div>
  );

  return (
    <>
      <style global jsx>
        {`
          .market-buy-btn {
            font-size: 1.25rem;
            width: 100%;
            max-width: 375px;
          }
          .nft-wrapper {
            width: 100%;
          }

          .icon-wrapper {
            width: 100%;
            height: 300px;
          }

          .icon-wrapper img {
            width: 100%;
            max-height: 300px;
            object-fit: contain;
          }

          // Small devices (landscape phones, 576px and up)
          @media (min-width: 576px) {
            .nft-wrapper {
              min-width: calc(95.5% / 1);
              max-width: 100%;
            }
          }

          // Medium devices (tablets, 768px and up)
          @media (min-width: 768px) {
            .nft-wrapper {
              min-width: calc(95.5% / 2);
              max-width: calc(95.5% / 2);
            }
          }

          // Large devices (desktops, 992px and up)
          @media (min-width: 992px) {
            .nft-wrapper {
              min-width: calc(95.5% / 2);
              max-width: calc(95.5% / 3);
            }
          }

          // X-Large devices (large desktops, 1200px and up)
          @media (min-width: 1200px) {
            .nft-wrapper {
              min-width: calc(95.5% / 4);
              max-width: calc(95.5% / 4);
            }
          }

          // XX-Large devices (larger desktops, 1400px and up)
          @media (min-width: 1400px) {
            .nft-wrapper {
              min-width: calc(95.5% / 4);
              max-width: calc(95.5% / 4);
            }
          }
        `}
      </style>
      <SEO
        title={`Trade on ${network} - Trade ${listingId} - Moika's Lookout`}
        description="moikaslookout.com: Moika's Lookout is a WEB3 Community that is focused on the development of decentralized applications and services as well providing gaming content."
        twitter='takolabsio'
        keywords='gaming, nfts, web3'
      />
      <div className='d-flex flex-row justify-content-center position-relative w-100 h-100'>
        <div className='wrapper d-flex flex-column p-3'>
          {isLoading ? (
            <div className='h-100 w-100 d-flex flex-row justify-content-center align-items-center'>
              <h4>
                Mowing Lawn
                <ANIM_Ellipsis />
              </h4>
            </div>
          ) : (
            <div className='d-flex flex-column px-0 px-md-5 pt-4'>
              <div className='d-flex flex-column flex-lg-row flex-wrap justify-content-between py-3'>
                <div className='d-flex flex-column'>
                  <h1>{trade.asset.name}</h1>
                  <h3 className='text-capitalize '>
                    <span className='border-bottom border-dark pe-5'>
                      {trade.type === 0 ? 'Direct Listing' : 'Auction'} on{' '}
                      {trade.network}
                    </span>
                  </h3>
                </div>
              </div>
              <div className='d-flex flex-column flex-lg-row'>
                <MediaRenderer
                  className='col col-lg-6 card mb-3'
                  src={trade.asset.image}
                />
                <div className='ms-0 ms-lg-4 d-flex flex-column w-100 align-items-end'>
                  {address && (
                    <Button
                      className='btn-dark market-buy-btn text-capitalize'
                      onClick={async (e) => {
                        network === 'ethereum' &&
                          switchNetwork(ChainId.Mainnet);
                        network === 'polygon' && switchNetwork(ChainId.Polygon);

                        // Prevent page from refreshing
                        e.preventDefault();
                        const price =
                          BN(trade.buyoutPrice._hex) /
                          BN(10 ** trade.buyoutCurrencyValuePerToken.decimals);

                        return dabu
                          ?.buy_nft({
                            listingId: trade.id,
                            quantity: 1,
                            address: address,
                            isGasless: false,
                            price: price,
                            currencyContractAddress:
                              trade.currencyContractAddress,
                            decimals:
                              trade.buyoutCurrencyValuePerToken.decimals,
                            network: network,
                          })
                          .then((res: any) => {
                            // alert('NFT bought successfully!');
                          })
                          .catch((e) => {
                            console.log(e);
                          });
                      }}>
                      Buy for{' '}
                      {BN(trade.buyoutPrice._hex) /
                        BN(
                          10 ** trade.buyoutCurrencyValuePerToken.decimals
                        )}{' '}
                      {trade.buyoutCurrencyValuePerToken.symbol}
                    </Button>
                  )}
                </div>
              </div>
              <hr />
              <div className='w-100'>
                <p title={trade.sellerAddress}>
                  <strong className='border-bottom border-dark pe-5'>
                    Sold By:{' '}
                  </strong>{' '}
                  <br />
                  {truncateAddress(trade.sellerAddress)}
                </p>
                <hr />
                <p>
                  <strong className='border-bottom border-dark pe-5'>
                    Description:
                  </strong>{' '}
                  <br />
                  {trade.asset.description}
                </p>
                <hr />
                <p>
                  More Coming Soon
                  <ANIM_Ellipsis />
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
