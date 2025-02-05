---
title: "Rebalancer: Protocol Asset Management"
date: 2024-06-19 10:11:00 -0700
description: Valence’s Rebalancer is a way for protocols — such as blockchains, dApps, rollups, and DAOs — to trustlessly manage their balance sheets. Audited by Oak Security, a beta version of the Rebalancer is live on mainnet and managing assets for early partners.
heroImagePath: /img/blog/rebalancer-more-whitespace.svg
---

# Introducing the Rebalancer

Valence’s Rebalancer is a way for protocols — such as blockchains, dApps, rollups, and DAOs — to trustlessly manage their balance sheets. Audited by Oak Security, a beta version of the Rebalancer is live on mainnet and managing assets for early partners. This post will explore the structural disadvantages that protocols face when managing assets, how the Rebalancer addresses those disadvantages, and how the Rebalancer works under the hood.

# Problem: Protocols are at a Structural Disadvantage

Many protocols want to maintain a percentage of their portfolio in stable coins to hedge against short term volatility. Many also want to hold a portfolio of assets in reserve at constant weightings without having to continuously trade assets manually to maintain that weighting. Unfortunately, protocols face structural disadvantages when attempting to manage their portfolios.

First and foremost, protocols have public governance, which make them easy targets for front running. Protocols could elect to use a trusted multisig to reduce the impact of this front running problem, but multisigs introduce a [whole new set of issues](https://x.com/TimewaveLabs/status/1765437233593778260?s=20).

Second, large trade sizes make orders susceptible to poor price execution. Protocols could break their trades into smaller transactions per governance proposition, but that adds operational overhead.

# Solution: The Rebalancer

The Rebalancer overcomes these structural disadvantages by enabling protocols to set a target portfolio, gradually make trades to hit that target portfolio, and continue making trades to maintain that portfolio until the protocol either sets a new target portfolio or stops using the Rebalancer.

The Rebalancer takes three inputs: a current portfolio, a target portfolio, and exchange policy as inputs. It then periodically computes assets to be sold or bought to incrementally move toward the target portfolio. At the end of each computation interval, the Rebalancer initiates a Dutch auction where market makers can bid for the assets being traded.

For example, a protocol may start out with a treasury that is composed entirely of its native token and want to reach a point where 10% of its treasury is in USDC. All that is required for a protocol to achieve its target treasury composition is to let the Rebalancer know its target treasury (i.e. 90% native token, 10% USDC) and how quickly it wants the rebalancing to take place—the slower the rebalancing, the better the price quality.

The Rebalancer will be available in the coming weeks on IBC-connected chains, as well as all [DAO DAO](https://daodao.zone/) DAOs through the DAO DAO interface! Special thanks to [Noah](https://twitter.com/noahsaso) and the DAO DAO team for all their hard work making this happen.

# How it Works

The Rebalancer is composed of two key components: the Portfolio Computer and the Auction. Any account on any IBC-connected chain that has an ICA controller or Polytone can use the Rebalancer.

![Figure 1](/img/blog/rebalancer-figure1-white.png)
_Figure 1. The Rebalancer is built using the CosmWasm stack. It is composed of two key components, the Portfolio Computer and the Auction systems._

## Portfolio Computer

The Portfolio Computer, described in Figure 2, is a control loop mechanism that uses feedback to periodically compute orders. The Portfolio Computer is triggered at every Rebalancing interval. It issues a correction based on proportional, integral, and derivative (PID) terms relative to the calculated error. The output of the control loop can optionally be clamped to limit large orders. Protocols set the tuning constants (Kp, Ki, Kd) when the contract is configured and they can continue to update the settings while the Rebalancer contract is active.

![Figure 2](/img/blog/rebalancer-figure2-white.png)
_Figure 2. Portfolio Computer_

Once created, protocols can adjust the Rebalancer in the following ways:

- Creating a portfolio with a given configuration
- Updating a portfolio’s configuration
- Creating a one-time order to be added on to the Auction (e.g., to convert an extra x% of assets in to stablecoins)

# Auction

The Auction system allows the creation of multiple simultaneous Dutch auctions. At every rebalancing interval, orders from portfolios are computed and aggregated and passed to their respective auction.

Auctions start at the conclusion of every rebalancing interval and last for the length of the configured auction window. During this window, the price for the asset descends until market makers purchase the assets or the asset reserve price is reached, whichever comes first. Once an auction receives a winning bid, the order is executed and payments are returned back to portfolio accounts pro rata by volume.

![Figure 3](/img/blog/rebalancer-figure3-white.png)
_Figure 3. Auction system with A auctions receiving aggregated orders from P portfolios._

# Conclusion

The Rebalancer is the first product designed specifically for protocols to efficiently manage their assets. If you are part of a chain, DAO, dApp, or protocol that wants to use the Rebalancer, contact [@ValenceZone](https://x.com/ValenceZone) for early access! If you are building a UI that supports chain governance proposals, DAO actions, or multisig transactions, get in touch to explore integrating the Rebalancer into your application. Or if you are developing an Actively Validated Service (AVS), staking protocol, or liquid staking protocols and are looking for help with balance sheet management or making timely payments in the correct asset, Valence dms are open: [@ValenceZone](https://x.com/ValenceZone).
