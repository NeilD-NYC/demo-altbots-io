export const graphData = {
  nodes: [
    // Fund Managers
    { id: "arcturus", name: "Arcturus Capital", type: "fund_manager", aum: 4.2, riskScore: 18, flag: "green", strategy: "Global Macro" },
    { id: "meridian", name: "Meridian Capital", type: "fund_manager", aum: 1.8, riskScore: 34, flag: "yellow", strategy: "Long/Short Equity" },
    { id: "ironwood", name: "Ironwood Systematic", type: "fund_manager", aum: 7.1, riskScore: 12, flag: "green", strategy: "Quantitative Equity" },
    { id: "helix", name: "Helix Credit Opp.", type: "fund_manager", aum: 2.3, riskScore: 78, flag: "red", strategy: "Distressed Credit" },
    { id: "northgate", name: "Northgate Event Driven", type: "fund_manager", aum: 3.6, riskScore: 22, flag: "green", strategy: "Event Driven" },
    { id: "solaris", name: "Solaris Private Credit", type: "fund_manager", aum: 0.9, riskScore: 41, flag: "yellow", strategy: "Private Credit" },
    { id: "tundra", name: "Tundra Macro", type: "fund_manager", aum: 5.5, riskScore: 29, flag: "green", strategy: "Global Macro" },
    { id: "vega", name: "Vega Special Sit.", type: "fund_manager", aum: 1.1, riskScore: 37, flag: "yellow", strategy: "Special Situations" },

    // Custodians / Prime Brokers
    { id: "gs", name: "Goldman Sachs", type: "custodian" },
    { id: "ms", name: "Morgan Stanley", type: "custodian" },
    { id: "jpm", name: "JPMorgan", type: "custodian" },
    { id: "db", name: "Deutsche Bank", type: "custodian" },
    { id: "barc", name: "Barclays", type: "custodian" },
    { id: "cs", name: "Credit Suisse", type: "custodian" },

    // Common Holdings (13F overlaps)
    { id: "aapl", name: "Apple Inc.", type: "holding", sector: "Technology" },
    { id: "msft", name: "Microsoft Corp.", type: "holding", sector: "Technology" },
    { id: "nvda", name: "NVIDIA Corp.", type: "holding", sector: "Technology" },
    { id: "amzn", name: "Amazon.com", type: "holding", sector: "Consumer" },
    { id: "jnj", name: "Johnson & Johnson", type: "holding", sector: "Healthcare" },
    { id: "xom", name: "Exxon Mobil", type: "holding", sector: "Energy" },
    { id: "tsla", name: "Tesla Inc.", type: "holding", sector: "Automotive" },
    { id: "meta", name: "Meta Platforms", type: "holding", sector: "Technology" },
  ],
  links: [
    // Custodian relationships
    { source: "arcturus", target: "gs", type: "custodied_by" },
    { source: "ironwood", target: "gs", type: "custodied_by" },
    { source: "meridian", target: "ms", type: "custodied_by" },
    { source: "northgate", target: "jpm", type: "custodied_by" },
    { source: "helix", target: "db", type: "custodied_by" },
    { source: "tundra", target: "barc", type: "custodied_by" },
    { source: "vega", target: "cs", type: "custodied_by" },

    // 13F holding overlaps
    { source: "arcturus", target: "aapl", type: "holds" },
    { source: "arcturus", target: "msft", type: "holds" },
    { source: "arcturus", target: "xom", type: "holds" },
    { source: "meridian", target: "aapl", type: "holds" },
    { source: "meridian", target: "nvda", type: "holds" },
    { source: "meridian", target: "tsla", type: "holds" },
    { source: "ironwood", target: "msft", type: "holds" },
    { source: "ironwood", target: "nvda", type: "holds" },
    { source: "ironwood", target: "meta", type: "holds" },
    { source: "ironwood", target: "amzn", type: "holds" },
    { source: "helix", target: "jnj", type: "holds" },
    { source: "helix", target: "xom", type: "holds" },
    { source: "northgate", target: "aapl", type: "holds" },
    { source: "northgate", target: "amzn", type: "holds" },
    { source: "northgate", target: "meta", type: "holds" },
    { source: "tundra", target: "msft", type: "holds" },
    { source: "tundra", target: "tsla", type: "holds" },
    { source: "tundra", target: "xom", type: "holds" },
    { source: "vega", target: "nvda", type: "holds" },
    { source: "vega", target: "jnj", type: "holds" },
    { source: "vega", target: "amzn", type: "holds" },
  ],
};
