import TAKO from '../../tako';
const {DateTime} = require('luxon');
//@ts-ignore
import DABU from '../../../dabu/index';
import Web3 from 'web3';
var BN: any = Web3.utils.hexToNumberString;

export default {
  Query: {
    Query_Market_Sell_Orders: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      let arr: any[] = [];
      const contract = new DABU(args.input.blockChain);
      const active_listings: any = await contract.get_active_nft_listings();
      // console.log(active_listings);
      for (const nft of active_listings) {
        const _tokenId = BN(nft.tokenId._hex);
        // console.log('_tokenId', _tokenId);
        const _quantity = BN(nft.quantity._hex);
        // console.log('_supply', _supply);
        const _price = BN(nft.buyoutPrice._hex);
        // console.log('_price', _price);

        const _startTimeInSeconds = BN(nft.startTimeInSeconds._hex);
        // console.log('_startTimeInSeconds', _startTimeInSeconds);
        const _secondsUntilEnd = BN(nft.secondsUntilEnd._hex);

        let now = Date.now();
        // console.log('assets',nft.asset);
        arr.push({
          ...nft,
          id: nft.id,
          tokenId: _tokenId,
          quantity: _quantity,
          contractAddress: nft.assetContractAddress,
          buyOutPrice: _price.substr(
            0,
            _price.length - nft.buyoutCurrencyValuePerToken.decimals
          ),
          currencySymbol: nft.buyoutCurrencyValuePerToken.symbol,

          decimals: nft.buyoutCurrencyValuePerToken.decimals,
          sellerAddress: nft.sellerAddress,
          startTime: DateTime.fromMillis(
            now - parseInt(_startTimeInSeconds)
          ).toLocaleString(DateTime.DATETIME_SHORT),
          endTime: DateTime.fromMillis(
            now + parseInt(_secondsUntilEnd)
          ).toLocaleString(DateTime.DATETIME_SHORT),
          asset: {
            ...nft.asset,
            id: BN(nft.asset.id._hex),
          },
        });
      }

      return {
        nfts: arr,
      };
    },
    Query_Address_NFTS: async (
      parent: object,
      args: any,
      _context: any,
      info: object
    ) => {
      // INIT DABU
      const contract = new DABU(args.input.blockChain);
      // Get Owned NFTs
      const res: any = await TAKO.get_items_by_owner(args.input.address);

      // Get Market NFTs
      const active_listings_as_raible_id: any = await contract
        .get_active_nft_listings()
        .then((res: any) => {
          return res.map((nft: any) => {
            const _tokenId = BN(nft.tokenId._hex);
            return `${
              args.input.blockChain
            }:${nft.assetContractAddress.toLowerCase()}:${_tokenId}`;
          });
        });
      // GET Listed NFTs

      var listed: any[] = [];
      var unlisted: any[] = [];

      for (var nft of res.nfts) {
      
        if (
          active_listings_as_raible_id.includes(nft.id) &&
          nft.blockchain === args.input.blockChain
        ) {
          listed.push(nft);
        }
      }

      for (var nft of res.nfts) {
        if (!listed.includes(nft) && nft.blockchain === args.input.blockChain) {
          unlisted.push(nft);
        }
      }

      return {
        continuation: res.continuation,
        unlisted,
        listed,
      };
    },
  },
};
