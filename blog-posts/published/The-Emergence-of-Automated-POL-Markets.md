---
title: "The Emergence of Automated POL Markets"
date: 2024-08-20 12:28:00 -0400
author: test
description: Patterns and best practices are starting to emerge when it comes to automating POL markets. Continue reading to learn about the evolution of POL deployments and what to expect in the future. 
---

![Header](/img/blog/emergence.png)

So you are convinced that your protocol would benefit from deploying protocol-owned liquidity (POL) — perhaps after reading the last blog [post](https://www.valence.zone/blog/4-Ways-that-POL-Adds-Value-Across-the-Interchain) about its benefits — but you are unsure about how best to go about implementing a POL strategy. You have come to the right place because Valence has facilitated more POL deployments than any other protocol. It’s still early days, but patterns and best practices are starting to emerge. Continue reading to learn about the evolution of POL deployments and what to expect in the future. 

# Phase 0: Unilateral POL Deployment

Before deploying any POL, it’s best to get clear on your protocol’s top objectives. Potential objectives include incentivizing an actively validated service (AVS) to purchase security from your protocol, increasing adoption of the liquid staking version of your protocol’s native token, deepening DEX liquidity for your native token, and/or stimulating the use of your protocol’s native token as collateral for borrowing.

Of your protocol’s top objectives, it’s best to start with a deployment that your protocol is capable of accomplishing unilaterally. For example, if your protocol’s objective is to increase adoption of the liquid staked version of its native token, your protocol could convert a portion of its native token to a liquid staked version of that token and pair that liquid staked version with the native token on a DEX. See the unilateral POL example from our earlier post on [Covenants](https://www.valence.zone/blog/Covenants_Protocol-to-Protocol_Deals) for more detail.

# Phase 1: Your Protocol’s First Bilateral Deal

Once your community has enough internal alignment to make financial decisions unilaterally, your protocol is ready to seek a bilateral deal. See our earlier post on [Covenants](https://www.valence.zone/blog/Covenants_Protocol-to-Protocol_Deals) for examples of bilateral deals. 

To attempt a bilateral deal, it’s best for each party to align on the representative(s) from each party that will champion the deal to their respective protocol. Representatives will want to align on deal terms and then communicate the draft deal terms to the rest of their respective communities for feedback. After the representatives receive the feedback, they usually then revisit the deal and incorporate the feedback that they deem necessary to make the deal palatable for both parties. Once the representatives realign on the deal, the representatives then propose the deal to their respective communities for official approval. 

Conducting POL deployments one governance proposal at a time is a good way for communities to become comfortable with liquidity deployment and the underlying deal structure, but 1-off governance has numerous drawbacks: the binary nature of proposals passing or failing, average token holders hoping their forum comments move the needle on modifying deal terms, and the static nature of deals, which remain unchanged until another proposal is passed. 

# Phase 2: Streamlining POL Deployments

Whether it’s after the first deal or after several more deals, protocol communities often desire a streamlining of the process so as to avoid governance fatigue and replace all-or-nothing fixed deals with variable and adjustable deals. 

The most straightforward way to streamline usually involves the formation of a liquidity council. This is the approach that Osmosis, Neutron, Stargaze, and others have pursued. The process is as simple as getting alignment on the people to serve on the liquidity council, setting the governance structure for the council, and funding the council with an initial amount of tokens. This reduces the governance overhead, however it still leaves little room for meaningful community engagement.

# Phase 3: Automating POL Deployments

The end game is to automate the lending and borrowing of POL. [Initia VIP](https://x.com/initiafdn/status/1819061479108407519?s=46&t=rvZb4Jaxn7P_KWJUBlmFEQ), [Berachain Proof-of-Liquidity](https://docs.berachain.com/learn/what-is-proof-of-liquidity), and [Hydro](https://forum.cosmos.network/t/atom-wars-introducing-the-hydro-auction-platform/13842) are early examples of automating the deployment of POL. All three endeavors use gauges that give all token holders the opportunity to participate in the direction of liquidity deployment. Protocols wishing to receive liquidity can incentivize token holders by boosting the rewards for their gauge similar to [Curve’s](https://resources.curve.fi/reward-gauges/boosting-your-crv-rewards/) boosts.  

Automating liquidity deployments with Curve-style gauges reduces governance overhead by enabling token holders to opt in to voting while also enabling the deals to adjust over time as gauge weights shift. This style of automation also gives transparency to the POL deployment process, engages the community, and introduces a market-based mechanism to allocate liquidity in real time. Most importantly, it empowers every token holder to participate in this POL deployment process by having their votes directly translate into increases and decreases in POL deployed to various positions. 

# The Role of Multisigs in POL Deployments

A trustless solution may not be available for a protocol the very first time they seek to deploy POL. If a trustless solution is not yet available to handle a POL deployment that your protocol seeks to do, a multisig is a viable temporary solution. Once a trustless solution (e.g., [Covenants](https://www.valence.zone/covenants)) is available, your protocol will want to migrate to the trustless solution so as to eliminate the [variety of issues](https://x.com/TimewaveLabs/status/1765437257492922808) inherent in the use of multisigs. 

# Make it Happen

Valence helps protocols upgrade from each phase to the next. Regardless of which phase your protocol is currently in, get in touch with Valence if you are interested in increasing your protocol’s sophistication with regard to POL deployments. DMs are open: [@ValenceZone](https://x.com/ValenceZone)
