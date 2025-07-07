// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

//ETH-USD 0x694AA1769357215DE4FAC081bf1f309aDC325306

library PriceConverter {
    address public constant ETH_USD_FEED =
        0x694AA1769357215DE4FAC081bf1f309aDC325306;
    address public constant USDC_USD_FEED =
        0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E;

    function getPrice(address feed) internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(feed);
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 1e10); // Convert to 18 decimals
    }

    function getConversionRate(
        uint256 amount,
        address feed
    ) internal view returns (uint256) {
        uint256 price = getPrice(feed);
        return (price * amount) / 1e18;
    }

    function getEthPrice() internal view returns (uint256) {
        return getPrice(ETH_USD_FEED);
    }

    function getUSDCPrice() internal view returns (uint256) {
        return getPrice(USDC_USD_FEED);
    }

    function getConversionRate(uint256 amount) internal view returns (uint256) {
        return getConversionRate(amount, ETH_USD_FEED);
    }
}
