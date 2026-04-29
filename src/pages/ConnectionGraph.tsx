import { useRef, useCallback, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";

const graphData = {
  nodes: [
    { id: "fm_arcturus", name: "Arcturus Capital", type: "fund_manager", aum: 4.2, strategy: "Global Macro", riskScore: 18, flag: "green" },
    { id: "fm_meridian", name: "Meridian Capital", type: "fund_manager", aum: 1.8, strategy: "Long/Short Equity", riskScore: 34, flag: "yellow" },
    { id: "fm_ironwood", name: "Ironwood Systematic", type: "fund_manager", aum: 7.1, strategy: "Quant Equity", riskScore: 12, flag: "green" },
    { id: "fm_helix", name: "Helix Credit", type: "fund_manager", aum: 2.3, strategy: "Distressed Credit", riskScore: 78, flag: "red" },
    { id: "fm_northgate", name: "Northgate Event Driven", type: "fund_manager", aum: 3.6, strategy: "Event Driven", riskScore: 22, flag: "green" },
    { id: "fm_solaris", name: "Solaris Private Credit", type: "fund_manager", aum: 0.9, strategy: "Private Credit", riskScore: 41, flag: "yellow" },
    { id: "fm_tundra", name: "Tundra Macro", type: "fund_manager", aum: 5.5, strategy: "Global Macro", riskScore: 29, flag: "green" },
    { id: "fm_vega", name: "Vega Special Situations", type: "fund_manager", aum: 1.1, strategy: "Special Situations", riskScore: 37, flag: "yellow" },
    { id: "h_aapl", name: "Apple (AAPL)", type: "holding", sector: "Technology" },
    { id: "h_msft", name: "Microsoft (MSFT)", type: "holding", sector: "Technology" },
    { id: "h_nvda", name: "NVIDIA (NVDA)", type: "holding", sector: "Technology" },
    { id: "h_googl", name: "Alphabet (GOOGL)", type: "holding", sector: "Technology" },
    { id: "h_amzn", name: "Amazon (AMZN)", type: "holding", sector: "Consumer" },
    { id: "h_meta", name: "Meta (META)", type: "holding", sector: "Technology" },
    { id: "h_brk", name: "Berkshire (BRK.B)", type: "holding", sector: "Financials" },
    { id: "h_jpm", name: "JPMorgan (JPM)", type: "holding", sector: "Financials" },
    { id: "h_unh", name: "UnitedHealth (UNH)", type: "holding", sector: "Healthcare" },
    { id: "h_gs", name: "Goldman Sachs (GS)", type: "holding", sector: "Financials" },
    { id: "h_spy", name: "SPDR S&P 500 (SPY)", type: "holding", sector: "ETF" },
    { id: "h_tlt", name: "iShares 20yr Treasury (TLT)", type: "holding", sector: "Fixed Income" },
    { id: "c_gs", name: "Goldman Sachs PB", type: "custodian" },
    { id: "c_ms", name: "Morgan Stanley PB", type: "custodian" },
    { id: "c_jpm", name: "JPMorgan PB", type: "custodian" },
    { id: "c_barc", name: "Barclays PB", type: "custodian" },
    { id: "c_db", name: "Deutsche Bank PB", type: "custodian" },
  ],
  links: [
    { source: "fm_arcturus", target: "h_aapl", type: "holds" },
    { source: "fm_arcturus", target: "h_msft", type: "holds" },
    { source: "fm_arcturus", target: "h_gs", type: "holds" },
    { source: "fm_arcturus", target: "h_spy", type: "holds" },
    { source: "fm_arcturus", target: "h_tlt", type: "holds" },
    { source: "fm_arcturus", target: "c_gs", type: "custodied_by" },
    { source: "fm_meridian", target: "h_aapl", type: "holds" },
    { source: "fm_meridian", target: "h_nvda", type: "holds" },
    { source: "fm_meridian", target: "h_meta", type: "holds" },
    { source: "fm_meridian", target: "h_amzn", type: "holds" },
    { source: "fm_meridian", target: "h_msft", type: "holds" },
    { source: "fm_meridian", target: "c_ms", type: "custodied_by" },
    { source: "fm_ironwood", target: "h_spy", type: "holds" },
    { source: "fm_ironwood", target: "h_msft", type: "holds" },
    { source: "fm_ironwood", target: "h_nvda", type: "holds" },
    { source: "fm_ironwood", target: "h_aapl", type: "holds" },
    { source: "fm_ironwood", target: "h_googl", type: "holds" },
    { source: "fm_ironwood", target: "c_gs", type: "custodied_by" },
    { source: "fm_helix", target: "h_jpm", type: "holds" },
    { source: "fm_helix", target: "h_brk", type: "holds" },
    { source: "fm_helix", target: "h_gs", type: "holds" },
    { source: "fm_helix", target: "h_tlt", type: "holds" },
    { source: "fm_helix", target: "h_unh", type: "holds" },
    { source: "fm_helix", target: "c_db", type: "custodied_by" },
    { source: "fm_northgate", target: "h_amzn", type: "holds" },
    { source: "fm_northgate", target: "h_googl", type: "holds" },
    { source: "fm_northgate", target: "h_meta", type: "holds" },
    { source: "fm_northgate", target: "h_msft", type: "holds" },
    { source: "fm_northgate", target: "h_brk", type: "holds" },
    { source: "fm_northgate", target: "c_jpm", type: "custodied_by" },
    { source: "fm_solaris", target: "h_jpm", type: "holds" },
    { source: "fm_solaris", target: "h_brk", type: "holds" },
    { source: "fm_solaris", target: "h_unh", type: "holds" },
    { source: "fm_solaris", target: "h_gs", type: "holds" },
    { source: "fm_solaris", target: "h_tlt", type: "holds" },
    { source: "fm_solaris", target: "c_ms", type: "custodied_by" },
    { source: "fm_tundra", target: "h_tlt", type: "holds" },
    { source: "fm_tundra", target: "h_spy", type: "holds" },
    { source: "fm_tundra", target: "h_googl", type: "holds" },
    { source: "fm_tundra", target: "h_aapl", type: "holds" },
    { source: "fm_tundra", target: "h_msft", type: "holds" },
    { source: "fm_tundra", target: "c_barc", type: "custodied_by" },
    { source: "fm_vega", target: "h_nvda", type: "holds" },
    { source: "fm_vega", target: "h_meta", type: "holds" },
    { source: "fm_vega", target: "h_amzn", type: "holds" },
    { source: "fm_vega", target: "h_unh", type: "holds" },
    { source: "fm_vega", target: "h_jpm", type: "holds" },
    { source: "fm_vega", target: "c_gs", type: "custodied_by" },
  ],
};

const FLAG_COLORS: Record<string, string> = {
  green: "#22C55E",
  yellow: "#F59E0B",
  red: "#EF4444",
};
const TYPE_COLORS: Record<string, string> = {
  fund_manager: "#22C55E",
  holding: "#3B82F6",
  custodian: "#C9A84C",
};

export default function ConnectionGraph() {
  const fgRef = useRef<any>();
  const [focusedNode, setFocusedNode] = useState<any>(null);
  const [highlightNodes, setHighlightNodes] = useState<Set<any>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<any>>(new Set());
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNodeClick = useCallback((node: any) => {
    const distance = 120;
    const distRatio =
      1 + distance / Math.hypot(node.x || 1, node.y || 1, node.z || 1);
    fgRef.current?.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
      node,
      1500
    );
    const newNodes = new Set<any>([node]);
    const newLinks = new Set<any>();
    graphData.links.forEach((link: any) => {
      const s = typeof link.source === "object" ? link.source.id : link.source;
      const t = typeof link.target === "object" ? link.target.id : link.target;
      if (s === node.id || t === node.id) {
        newLinks.add(link);
        graphData.nodes.forEach((n) => {
          if (n.id === s || n.id === t) newNodes.add(n);
        });
      }
    });
    setHighlightNodes(newNodes);
    setHighlightLinks(newLinks);
    setFocusedNode(node);
  }, []);

  const selectNodeById = useCallback((id: string) => {
    const liveNode = (fgRef.current?.graphData?.().nodes || graphData.nodes).find(
      (n: any) => n.id === id
    );
    if (!liveNode) return;
    handleNodeClick(liveNode);
    setSearch(liveNode.name);
    setSearchOpen(false);
  }, [handleNodeClick]);

  const handleBackgroundClick = useCallback(() => {
    setFocusedNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
  }, []);

  const getNodeObject = useCallback(
    (node: any) => {
      const isLit = !focusedNode || highlightNodes.has(node);
      const color = node.flag ? FLAG_COLORS[node.flag] : TYPE_COLORS[node.type];
      const activeColor = isLit ? color : "#111122";

      const group = new THREE.Group();

      let geometry: THREE.BufferGeometry;
      if (node.type === "fund_manager") {
        geometry = new THREE.SphereGeometry(
          Math.max(4, (node.aum || 1) * 0.8),
          32,
          32
        );
      } else if (node.type === "holding") {
        geometry = new THREE.BoxGeometry(5, 5, 5);
      } else {
        geometry = new THREE.OctahedronGeometry(7);
      }

      const mat = new THREE.MeshLambertMaterial({
        color: activeColor,
        transparent: true,
        opacity: isLit ? 0.9 : 0.1,
        emissive: new THREE.Color(activeColor),
        emissiveIntensity: isLit ? 0.9 : 0,
      });

      group.add(new THREE.Mesh(geometry, mat));

      if (isLit) {
        const light = new THREE.PointLight(color, 2.0, 80);
        group.add(light);
      }

      if (node.flag === "red" && isLit) {
        let frame = 0;
        const pulse = () => {
          frame++;
          mat.emissiveIntensity = 0.5 + Math.sin(frame / 15) * 0.5;
          requestAnimationFrame(pulse);
        };
        pulse();
      }

      return group;
    },
    [focusedNode, highlightNodes]
  );

  const getNodeLabel = useCallback((node: any) => {
    const color = node.flag ? FLAG_COLORS[node.flag] : TYPE_COLORS[node.type];
    const detail =
      node.type === "fund_manager"
        ? `AUM: $${node.aum}B  |  Risk: ${node.riskScore}/100`
        : node.type === "holding"
        ? `Sector: ${node.sector}`
        : "Prime Broker / Custodian";
    return `<div style="background:rgba(10,10,30,0.95);padding:10px 14px;border-radius:6px;border:1px solid ${color};color:#fff;font-family:Inter,sans-serif;pointer-events:none">
      <b style="color:${color};font-size:13px">${node.name}</b><br/>
      <span style="color:#ccc;font-size:11px">${detail}</span>
    </div>`;
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 180px)",
        background: "#0D1117",
      }}
    >
      {/* Legend */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          zIndex: 10,
          background: "rgba(10,10,30,0.9)",
          border: "1px solid #30363D",
          borderRadius: 8,
          padding: "12px 16px",
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          fontSize: 12,
        }}
      >
        <div style={{ color: "#C9A84C", fontWeight: 700, marginBottom: 8 }}>
          INTERCONNECTION MAP
        </div>
        {[
          { color: "#22C55E", shape: "●", label: "Fund Manager" },
          { color: "#3B82F6", shape: "■", label: "Top Positions" },
          { color: "#C9A84C", shape: "◆", label: "Custodian / Prime Broker" },
        ].map(({ color, shape, label }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span style={{ color, fontSize: 16 }}>{shape}</span>
            <span style={{ color: "#ccc" }}>{label}</span>
          </div>
        ))}
        <div
          style={{
            borderTop: "1px solid #30363D",
            marginTop: 8,
            paddingTop: 8,
            color: "#888",
          }}
        >
          Click any node to focus
        </div>
      </div>

      {/* Focus panel */}
      {focusedNode?.type === "fund_manager" && (
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
            width: 240,
            background: "rgba(10,10,30,0.95)",
            border: `1px solid ${FLAG_COLORS[focusedNode.flag] || "#C9A84C"}`,
            borderRadius: 8,
            padding: "12px 16px",
            color: "#fff",
            fontFamily: "Inter, sans-serif",
            fontSize: 12,
          }}
        >
          <div
            style={{
              color: FLAG_COLORS[focusedNode.flag],
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 8,
            }}
          >
            {focusedNode.name}
          </div>
          <div style={{ color: "#ccc", lineHeight: 1.8 }}>
            Strategy: {focusedNode.strategy}<br />
            AUM: ${focusedNode.aum}B<br />
            Risk Score:{" "}
            <span
              style={{
                color:
                  focusedNode.riskScore > 50
                    ? "#EF4444"
                    : focusedNode.riskScore > 30
                    ? "#F59E0B"
                    : "#22C55E",
              }}
            >
              {focusedNode.riskScore}/100
            </span>
            <br />
            Status:{" "}
            <span style={{ color: FLAG_COLORS[focusedNode.flag] }}>
              {focusedNode.flag === "red"
                ? "⚠ ELEVATED RISK"
                : focusedNode.flag === "yellow"
                ? "MONITOR"
                : "CLEAR"}
            </span>
          </div>
        </div>
      )}

      <ForceGraph3D
        ref={fgRef}
        graphData={graphData as any}
        backgroundColor="#0D1117"
        nodeThreeObject={getNodeObject as any}
        nodeLabel={getNodeLabel as any}
        nodeThreeObjectExtend={false}
        linkColor={(link: any) => {
          if (!focusedNode)
            return link.type === "custodied_by" ? "#C9A84C" : "#3B82F6";
          return highlightLinks.has(link)
            ? link.type === "custodied_by"
              ? "#C9A84C"
              : "#3B82F6"
            : "#0a0a14";
        }}
        linkWidth={(link: any) => (highlightLinks.has(link) ? 2 : 0.4)}
        linkOpacity={0.5}
        linkDirectionalParticles={(link: any) =>
          highlightLinks.has(link) ? 5 : 1
        }
        linkDirectionalParticleSpeed={0.004}
        linkDirectionalParticleWidth={(link: any) =>
          highlightLinks.has(link) ? 3 : 1
        }
        linkDirectionalParticleColor={(link: any) =>
          link.type === "custodied_by" ? "#C9A84C" : "#3B82F6"
        }
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        warmupTicks={80}
        cooldownTicks={150}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
    </div>
  );
}
