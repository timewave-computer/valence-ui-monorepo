---
title: "4 Ways that Protocol-Owned Liquidity Adds Value Across the Interchain"
date: 2024-07-29 13:39:00 -0400
author: test
description: This blog post will build up the concept of “liquidity,” describe how it relates to protocol-owned liquidity (POL), and explain four ways your crypto-native community can benefit from POL today. 
---

This blog post will build up the concept of “liquidity,” describe how it relates to protocol-owned liquidity (POL), and explain four ways your crypto-native community can benefit from POL today. 

# What is Liquidity
 
In order to understand  "liquidity," we’ll first want to define "price impact" and “rate impact.” 

"Price impact" is the change in asset price directly caused by a trade. For example, if you have 2 apples and the market price is $1/apple, you might think your apples are worth $2. However, after selling the first apple, if the next buyer is only willing to pay $0.98, after selling both apples you would only receive a total of $1.98, thereby causing a 1% price impact ($0.02/2.00 = 1%). 

"Rate impact" is a similar concept applied to the change in interest rates caused by a loan. Like trading markets, lending markets are governed by supply and demand. As the demand for loans increases relative to supply, the interest rate rises, and vice versa. For example, if the current interest rate on a lending protocol is 5% and you want to borrow $100K, you may think you could borrow the full $100K with $5K interest payments. However, if the rate for the first $50K you borrow is 5% and the rate for the second $50K is 6%, you would actually have to pay $5.5K annually.

Now we're ready to discuss liquidity. An asset’s liquidity is a function of how much price impact would be incurred by trading that asset or rate impact would be incurred by borrowing/lending that asset. The smaller the price impact or rate impact, the deeper the liquidity. 

# What is Protocol-Owned Liquidity

In addition to the usual sources of liquidity, such as individuals, market makers, and investment firms, protocols can also be a source of liquidity. Protocol-owned liquidity (POL) is a term used to describe situations where protocols provide liquidity in such a way that the protocol continues to own the liquidity it provides. 

For examples of POL in action, see the “Structuring protocol-to-protocol liquidity deals” section from our earlier blog post [here](https://www.valence.zone/blog/Covenants_Protocol-to-Protocol_Deals). 

# 4 Ways that POL Can Help Your Crypto-Native Community Today

There are a variety of ways POL can benefit developing protocol ecosystems. While this list isn’t exhaustive, here are four important dimensions of growth. 

## 1. Increase decentralized exchange (DEX) liquidity

Traders want to trade on the DEX in which they will receive the best price execution. The DEX with the most liquidity will be able to offer the best price execution because more liquidity means less price impact per trade on a dollar-for-dollar basis. 

Additionally, providers of liquidity (LPers) want to provide liquidity on the DEX in which they will generate the most fees and incur the smallest loss versus rebalancing ([LVR](https://members.delphidigital.io/learn/loss-versus-rebalancing-lvr)). The DEX with the most liquidity will attract more traders, and therefore generate more fees. In general, LPers on the DEX with the most liquidity will incur the least LVR since it will have the lowest price impact per trade. 

Since DEXs compete with each other to have the most liquidity, they benefit from sourcing liquidity from as many places as possible, including protocols. By sourcing POL, DEXs increase pool depth, which minimizes price impact for traders, inducing more transaction volume, resulting in more fees for LPs, creating a virtuous cycle of attracting more liquidity. 

![Example 1](/img/blog/4-reasons-1.png)
_Figure 1. Virtuous cycle of POL provisioned to a DEX_

2. Increase lending protocol liquidity

Borrowers want to borrow from the protocol that offers them the largest loans with the smallest amount of collateral at the lowest cost. The lending protocol with the most liquidity will be able to offer the best terms because more capital available for borrowing means less rate impact per borrow on a dollar-for-dollar basis.

Additionally, lenders want to lend to the protocol that will generate them the highest risk-adjusted returns. The lending protocol with the most liquidity will attract more borrowers, thus generating more fees.  More fee revenue accruing to the protocol enables reinvesting into features that will increase risk-adjusted returns, such as an insurance fund.

Since lending protocols compete with each other for borrowable liquidity, they benefit from sourcing liquidity from as many places as possible, including protocols. By sourcing POL, lending protocols increase their liquidity, decreasing rate impact, this attracts more borrowers, resulting in more fees, which again creates a virtuous cycle of attracting more liquidity.

![Example 2](/img/blog/4-reasons-2.png)
_Figure 2. Virtuous cycle of POL provisioned to a lending protocol_

## 3. Increase native token value by charging interest for POL

Since DeFi protocols across all of crypto are competing for liquidity, protocols have an opportunity to monetize the demand for their POL by charging interest on lent POL. If the interest rate is denominated in the same token as the POL, the interest payment will automatically generate upward price pressure on the token because borrowers would have to buy the token in order to meet their interest payments.   

For example, a protocol could make $100M worth of its native token available for borrowing by a specific pool on a whitelisted DEX. The protocol charges a 1% fixed interest rate denominated in their native token. If the DEX were to borrow the full $100M, it would have to buy $1M worth of the POL lender’s native token by the end of the year in order to service the loan’s interest payments, thereby increasing the protocol’s token’s value by generating $1M in net-new purchases of the token. 

![Example 3](/img/blog/4-reasons-3.png)
_Figure 3. How lending POL leads to increased token price_

## 4. Increase ecosystem attractiveness

Crypto projects have many options when it comes to which blockchain to build on, where to derive security (e.g. staking, restaking), and which ecosystem to develop within. Apart from the tech and the vibes, the primary reason a new crypto project would choose to align with one ecosystem over the other is the amount of liquidity and users the new protocol expects to attract via alignment with that ecosystem. Rather than leaving the amount of liquidity to chance, protocols seeking to attract new projects could offer POL to those new projects for free, or at low cost. Unlike grants that often result in complete liquidation and maximum downward price pressure, POL remains owned by the protocol providing the liquidity loan, which makes it a capital efficient means of attracting new projects. 

For example, say a new actively validated service (AVS) may be choosing between EigenLayer and Babylon as potential security providers. If EigenLayer (or an LRT within the EigenLayer ecosystem) were to supplement the security contract by offering POL paired with the AVS’s native token, the AVS will take into consideration the day-1 liquidity and price support their token will receive into their selection of security vendor.

# How to Start Deploying Protocol Liquidity

## Easy Mode: Rebalancer

Striking a liquidity deal as a decentralized protocol can be difficult. If you are concerned that your protocol’s community is not sufficiently aligned to find agreeable terms with an external party, one relatively easy first step is to cultivate internal alignment by working together on a strategy for managing your protocol’s treasury. Valence’s [Rebalancer](https://www.valence.zone/blog/Rebalancer-Protocol-Asset-Management) gives protocols an extremely simple entry point for cross-chain asset management.

The Rebalancer is live on mainnet today in private beta. Get in touch if you are interested in gaining early access: [@ValenceZone](https://x.com/ValenceZone)

## Advanced Mode: Covenants

If you are ready to strike a POL deal with an external party, you can close protocol-to-protocol deals without intermediary multisigs by using Valence’s [Covenant](https://www.valence.zone/blog/Covenants_Protocol-to-Protocol_Deals) system. 

Covenants are live on mainnet today in private beta. Get in touch if you are interested in gaining early access: [@ValenceZone](https://x.com/ValenceZone)
