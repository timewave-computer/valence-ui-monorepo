---
title: "Valence Protocol"
date: 2024-06-10 11:32:00 -0400
author: "Max Einhorn"
description: "Valence is a cross-chain protocol that enables crypto-native organizations, such as chains, dApps, DAOs, and other protocols, to enter into programmatic relationships with other crypto-native organizations."
---

# About Valence and Timewave

Valence is a cross-chain protocol that enables crypto-native organizations, such as chains, dApps, DAOs, and other protocols, to enter into programmatic relationships with other crypto-native organizations.

Timewave is the team leading the development of the Valence Protocol. Timewave’s mission is to develop software that improves long-term, permissionless collaboration across the interchain.

# Why Valence Matters

A fully developed vision for the interchain involves more than just a network of many sovereign blockchains—it is a rich economy where interoperability allows crypto-native organizations to engage in commerce. Valence aims to do just that by increasing the scope and scale of what crypto-native organizations can do together.

Valence increases the scope of interoperability by furthering the capabilities of the Inter-Blockchain Communication (IBC) protocol. IBC already enables the one-way transfer of assets from one blockchain to another. Valence takes IBC a step further by enabling programmatic economic relationships between crypto-native organizations. These economic relationships could be as simple as a token swap or have more advanced characteristics, such as adjusting treasury compositions according to market conditions or lending protocol-owned liquidity (POL).

Valence increases the scale of interoperability by working not only with Cosmos SDK chains, but also with any crypto-native entity that is capable of expressing an intent, including Bitcoin Layer 2s (L2), Ethereum protocols, Solana DAOs, and degens and regens anywhere.

As an early use case to demonstrate the power of programmatic interchain agreements, Timewave is using Valence to create markets for crypto-native organizations to lend POL. This POL lending market is particularly valuable to the restaking ecosystem, but will be broadly useful for any ecosystem looking to build liquidity around one or more assets.

# How Valence Supports Restaking

The restaking services provided by the Cosmos Hub, EigenLayer, and other shared security protocols have brought mainstream awareness to the value of protocol-to-protocol dealmaking because shared security is type of transaction between two protocols—the restaking protocol that lends security and the Actively Validated Service (AVS, a.k.a. “consumer chain”) that borrows the security. Alignment is one of the biggest factors for AVSs when choosing the protocol from which to borrow security. However, what AVSs primarily want from alignment is liquidity.

Rather than leave AVSs hoping that alignment will result in the liquidity they desire, Valence enables AVSs to know exactly how much liquidity they will receive and how long they will receive it for. Valence accomplishes this level of transparency by enabling restaking and liquid restaking protocols to make a pool of capital available for AVS borrowing and define a function for how to adjust interest rates according to demand for that liquidity. This also benefits the restaking protocols by making their security offerings more attractive and generating a new source of revenue via the interest they charge.

While Valence could enable AVSs to borrow capital from restaking protocols outright, usually AVSs borrow POL from the restaking protocols. In these POL deals, the restaking protocols continue to own the assets they are lending to the AVS. It is still in the interest of the AVS to pay for these assets because the assets can be used to provide price support for the AVS’s native token and/or the AVS’s native DeFi economy.

While demand for Valence has initially been coming from restaking, any crypto-native organization can use Valence to create POL markets.

# Valence Beyond the Restaking Ecosystem

While charging interest for POL makes sense when one protocol has significantly more liquidity than the other protocol, Valence is also useful in situations where both protocols have similar amounts of liquidity.

Even when two protocols have similar amounts of liquidity for their native tokens generally, there may not be meaningful liquidity for the trading pair between the two protocols’ native tokens. In these situations, the protocols could use Valence to lend equal amounts of POL to each other without interest to increase the liquidity for that trading pair. This deal structure is often referred to as two-party POL.

For example, Neutron and Stargaze recently engaged in a two-party POL deal where [Neutron](http://governance.neutron.org/proposals/A/38) contributed $200K worth of NTRN and [Stargaze](https://www.stargaze.zone/vote/proposal/272) contributed $200K worth of STARS to provide $400K total liquidity to the NTRN:STARS trading pair on Astroport.

# How Valence Works

## Today

Valence is already one of the most complex applications written with IBC. Valence extensively uses interchain accounts (ICAs), Polytone, CosmWasm, and packet forward middleware to enable Cosmos chain governance modules or DAO DAO DAOs to autonomously orchestrate multichain workflows. Valence packages these sets of technologies into two subprotocols: Covenants and Rebalancer.

Covenants are a way for crypto-native organizations to transact with each other in a trust-minimized way. Covenants support token swaps, single-party POL (e.g., Hub prop 800), and multi-party POL deals (e.g., Neutron prop A-33). Advanced features include price fluctuation tolerance, deposit durations, lockup durations, ragequitting for a fee, various liquidity ownership structures, and the ability to charge interest.

The Rebalancer is a balance sheet management solution custom-built for crypto-native organizations. Anyone can use the Rebalancer to set a desired portfolio (e.g., 90% native token, 10% USDC), steadily rebalance to that desired portfolio over time, and maintain that portfolio until advised otherwise. The Rabalancer can also efficiently swap AVS assets into the restaking protocol’s native asset.

## Soon

Valence will expand to service Bitcoin layer 2 (L2), Ethereum protocol, and Solana dApps, allowing Cosmos applications to enter into agreements with strategic partners in neighboring ecosystems. Valence will achieve this level of chain abstraction by supplementing its IBC-based workflow with an intent system specifically designed for crypto-native organizations. Protocols will be able to express intents to engage in economic activity, which Valence will then route to an auction for solvers to bid on the right to execute. Intents can be combined with application-specific messages or IBC orchestration to enrich the scope of protocol interaction.

# Wrapping Up

Valence will enable greater cohesion and cooperation throughout the interchain. Rather than simply being able to move assets from one chain to another, Valence enables any crypto-native organization anywhere to enter into ongoing economic relationships with any other crypto-native entity. This expansion of the scope and scale of interchain capabilities has the potential to increase capital efficiency across the interchain, improve incentive alignment within and across ecosystems, and enable participants in crypto to take higher leverage action together, scaling their ambition.

# Let’s Grow Together

If you are a member of a blockchain, dApp, DAO, rollup, rollchain, protocol, or any other crypto-native organization and are interested in learning more about how Valence can serve you and your community, we would be happy to speak with you. We could help your organization integrate with the Rebalancer, advise your organization on collaboration opportunities with other crypto-native organizations, and enable your organization to participate in POL markets. Our dms are open: [@ValenceZone](https://x.com/ValenceZone).

![image](https://github.com/timewave-computer/valence-ui/assets/33480758/7d2e65a9-cc8a-4166-a929-b7edd11aaa22)
