export enum KeyTag {
  historicalAmount = ".historical-amount",
  historicalValue = ".historical-value",
  projectedValue = ".projected-value",
  projectedAmount = ".projected-amount",
  historicalTargetValue = ".historical-target-value",
  projectedTargetValue = ".projected-target-value",
  price = ".price",
}

export class GraphKey {
  static historicalAmount(symbol: string) {
    return `${symbol}${KeyTag.historicalAmount}`;
  }

  static historicalValue(symbol: string) {
    return `${symbol}${KeyTag.historicalValue}`;
  }
  static projectedValue(symbol: string) {
    return `${symbol}${KeyTag.projectedValue}`;
  }
  static projectedAmount(symbol: string) {
    return `${symbol}${KeyTag.projectedAmount}`;
  }
  static historicalTargetValue(symbol: string) {
    return `${symbol}${KeyTag.historicalTargetValue}`;
  }
  static projectedTargetValue(symbol: string) {
    return `${symbol}${KeyTag.projectedTargetValue}`;
  }

  static price(symbol: string) {
    return `${symbol}${KeyTag.price}`;
  }
}
