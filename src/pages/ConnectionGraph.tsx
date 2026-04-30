import { useRef, useCallback, useState, useEffect } from "react";
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
    { id: "fm_vega", name: "Vega Special Sits", type: "fund_manager", aum: 1.1, strategy: "Special Situations", riskScore: 37, flag: "yellow" },
    { id: "c_gs", name: "Goldman Sachs PB", type: "custodian" },
    { id: "c_ms", name: "Morgan Stanley PB", type: "custodian" },
    { id: "c_jpm", name: "JPMorgan PB", type: "custodian" },
    { id: "c_barc", name: "Barclays PB", type: "custodian" },
    { id: "c_ubs", name: "UBS PB", type: "custodian" },
    { id: "c_bnp", name: "BNP Paribas PB", type: "custodian" },
    { id: "c_hsbc", name: "HSBC PB", type: "custodian" },
    { id: "c_bofa", name: "Bank of America PB", type: "custodian" },
    { id: "c_citi", name: "Citibank PB", type: "custodian" },
    { id: "c_fid", name: "Fidelity Clearing", type: "custodian" },
    { id: "c_bny", name: "BNY Mellon", type: "custodian" },
    { id: "c_sst", name: "State Street", type: "custodian" },
    { id: "h_nvda", name: "NVIDIA (NVDA)", type: "holding", sector: "Technology" },
    { id: "h_msft", name: "Microsoft (MSFT)", type: "holding", sector: "Technology" },
    { id: "h_amzn", name: "Amazon (AMZN)", type: "holding", sector: "Consumer" },
    { id: "h_googl", name: "Alphabet (GOOGL)", type: "holding", sector: "Technology" },
    { id: "h_nflx", name: "Netflix (NFLX)", type: "holding", sector: "Media" },
    { id: "h_aapl", name: "Apple (AAPL)", type: "holding", sector: "Technology" },
    { id: "h_amd", name: "AMD", type: "holding", sector: "Technology" },
    { id: "h_avgo", name: "Broadcom (AVGO)", type: "holding", sector: "Technology" },
    { id: "h_tsm", name: "TSMC (TSM)", type: "holding", sector: "Technology" },
    { id: "h_mu", name: "Micron (MU)", type: "holding", sector: "Technology" },
    { id: "h_amat", name: "Applied Materials (AMAT)", type: "holding", sector: "Technology" },
    { id: "h_vrt", name: "Vertiv (VRT)", type: "holding", sector: "Technology" },
    { id: "h_app", name: "AppLovin (APP)", type: "holding", sector: "Technology" },
    { id: "h_uber", name: "Uber (UBER)", type: "holding", sector: "Consumer" },
    { id: "h_cvna", name: "Carvana (CVNA)", type: "holding", sector: "Consumer" },
    { id: "h_gev", name: "GE Vernova (GEV)", type: "holding", sector: "Industrials" },
    { id: "h_c", name: "Citigroup (C)", type: "holding", sector: "Financials" },
    { id: "h_corz", name: "Core Scientific (CORZ)", type: "holding", sector: "Technology" },
    { id: "h_cpng", name: "Coupang (CPNG)", type: "holding", sector: "Consumer" },
    { id: "h_sats", name: "EchoStar (SATS)", type: "holding", sector: "Technology" },
    { id: "h_lite", name: "Lumentum (LITE)", type: "holding", sector: "Technology" },
    { id: "h_sndk", name: "SanDisk (SNDK)", type: "holding", sector: "Technology" },
  ],
  links: [
    { source: "fm_arcturus", target: "c_gs", type: "custodied_by" },
    { source: "fm_arcturus", target: "c_ms", type: "custodied_by" },
    { source: "fm_arcturus", target: "c_jpm", type: "custodied_by" },
    { source: "fm_arcturus", target: "c_barc", type: "custodied_by" },
    { source: "fm_arcturus", target: "h_nvda", type: "holds" },
    { source: "fm_arcturus", target: "h_msft", type: "holds" },
    { source: "fm_arcturus", target: "h_googl", type: "holds" },
    { source: "fm_arcturus", target: "h_amzn", type: "holds" },
    { source: "fm_arcturus", target: "h_vrt", type: "holds" },
    { source: "fm_meridian", target: "c_gs", type: "custodied_by" },
    { source: "fm_meridian", target: "c_ms", type: "custodied_by" },
    { source: "fm_meridian", target: "c_ubs", type: "custodied_by" },
    { source: "fm_meridian", target: "c_bnp", type: "custodied_by" },
    { source: "fm_meridian", target: "h_nvda", type: "holds" },
    { source: "fm_meridian", target: "h_aapl", type: "holds" },
    { source: "fm_meridian", target: "h_nflx", type: "holds" },
    { source: "fm_meridian", target: "h_amd", type: "holds" },
    { source: "fm_meridian", target: "h_avgo", type: "holds" },
    { source: "fm_ironwood", target: "c_gs", type: "custodied_by" },
    { source: "fm_ironwood", target: "c_ms", type: "custodied_by" },
    { source: "fm_ironwood", target: "c_hsbc", type: "custodied_by" },
    { source: "fm_ironwood", target: "c_bofa", type: "custodied_by" },
    { source: "fm_ironwood", target: "h_nvda", type: "holds" },
    { source: "fm_ironwood", target: "h_msft", type: "holds" },
    { source: "fm_ironwood", target: "h_amzn", type: "holds" },
    { source: "fm_ironwood", target: "h_tsm", type: "holds" },
    { source: "fm_ironwood", target: "h_mu", type: "holds" },
    { source: "fm_helix", target: "c_ms", type: "custodied_by" },
    { source: "fm_helix", target: "c_jpm", type: "custodied_by" },
    { source: "fm_helix", target: "c_citi", type: "custodied_by" },
    { source: "fm_helix", target: "h_nvda", type: "holds" },
    { source: "fm_helix", target: "h_googl", type: "holds" },
    { source: "fm_helix", target: "h_c", type: "holds" },
    { source: "fm_helix", target: "h_corz", type: "holds" },
    { source: "fm_helix", target: "h_sats", type: "holds" },
    { source: "fm_northgate", target: "c_gs", type: "custodied_by" },
    { source: "fm_northgate", target: "c_ms", type: "custodied_by" },
    { source: "fm_northgate", target: "c_bofa", type: "custodied_by" },
    { source: "fm_northgate", target: "c_ubs", type: "custodied_by" },
    { source: "fm_northgate", target: "h_nvda", type: "holds" },
    { source: "fm_northgate", target: "h_amzn", type: "holds" },
    { source: "fm_northgate", target: "h_nflx", type: "holds" },
    { source: "fm_northgate", target: "h_uber", type: "holds" },
    { source: "fm_northgate", target: "h_cvna", type: "holds" },
    { source: "fm_solaris", target: "c_gs", type: "custodied_by" },
    { source: "fm_solaris", target: "c_bny", type: "custodied_by" },
    { source: "fm_solaris", target: "c_sst", type: "custodied_by" },
    { source: "fm_solaris", target: "h_nvda", type: "holds" },
    { source: "fm_solaris", target: "h_msft", type: "holds" },
    { source: "fm_solaris", target: "h_aapl", type: "holds" },
    { source: "fm_solaris", target: "h_gev", type: "holds" },
    { source: "fm_solaris", target: "h_amat", type: "holds" },
    { source: "fm_tundra", target: "c_ms", type: "custodied_by" },
    { source: "fm_tundra", target: "c_hsbc", type: "custodied_by" },
    { source: "fm_tundra", target: "c_bnp", type: "custodied_by" },
    { source: "fm_tundra", target: "c_barc", type: "custodied_by" },
    { source: "fm_tundra", target: "h_nvda", type: "holds" },
    { source: "fm_tundra", target: "h_googl", type: "holds" },
    { source: "fm_tundra", target: "h_msft", type: "holds" },
    { source: "fm_tundra", target: "h_app", type: "holds" },
    { source: "fm_tundra", target: "h_cpng", type: "holds" },
    { source: "fm_vega", target: "c_gs", type: "custodied_by" },
    { source: "fm_vega", target: "c_ms", type: "custodied_by" },
    { source: "fm_vega", target: "c_fid", type: "custodied_by" },
    { source: "fm_vega", target: "h_nvda", type: "holds" },
    { source: "fm_vega", target: "h_nflx", type: "holds" },
    { source: "fm_vega", target: "h_aapl", type: "holds" },
    { source: "fm_vega", target: "h_lite", type: "holds" },
    { source: "fm_vega", target: "h_sndk", type: "holds" },
  ]
};

const FLAG_COLORS: Record<string, string> = {
  green: "#00ff88", yellow: "#ffaa00", red: "#ff2244"
};

const TYPE_COLORS: Record<string, string> = {
  fund_manager: "#00ff88", holding: "#00aaff", custodian: "#ffd700"
};

export default function ConnectionGraph() {
  const fgRef = useRef<any>();
  const [focusedNode, setFocusedNode] = useState<any>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());

  useEffect(() => {
    const t = setTimeout(() => {
      fgRef.current?.cameraPosition({ x: 0, y: 0, z: 500 });
      const scene = fgRef.current?.scene?.();
      if (scene) {
        const ambientLight = new THREE.AmbientLight(0x111133, 0.4);
        scene.add(ambientLight);
      }
    }, 100);
    return () => clearTimeout(t);
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    const distance = 120;
    const distRatio = 1 + distance /
      Math.hypot(node.x || 1, node.y || 1, node.z || 1);

    fgRef.current?.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
      node, 1500
    );

    const newNodes = new Set<any>([node]);
    const newLinks = new Set<any>();

    graphData.links.forEach((link: any) => {
      const s = typeof link.source === "object" ? link.source.id : link.source;
      const t = typeof link.target === "object" ? link.target.id : link.target;
      if (s === node.id || t === node.id) {
        newLinks.add(link);
        graphData.nodes.forEach(n => { if (n.id === s || n.id === t) newNodes.add(n); });
      }
    });

    setHighlightNodes(newNodes);
    setHighlightLinks(newLinks);
    setFocusedNode(node);
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setFocusedNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
  }, []);

  const getNodeObject = useCallback((node: any) => {
    const isLit = !focusedNode || highlightNodes.has(node);
    const color = node.flag ? FLAG_COLORS[node.flag] : TYPE_COLORS[node.type];
    const activeColor = isLit ? color : "#111122";

    const group = new THREE.Group();
    let geometry: THREE.BufferGeometry;

    if (node.type === "fund_manager") {
      geometry = new THREE.SphereGeometry(Math.max(6, (node.aum || 1) * 1.2), 64, 64);
    } else if (node.type === "holding") {
      geometry = new THREE.SphereGeometry(3.5, 16, 16);
    } else {
      geometry = new THREE.OctahedronGeometry(8);
    }

    const mat = new THREE.MeshLambertMaterial({
      color: activeColor,
      transparent: true,
      opacity: isLit ? 0.9 : 0.1,
      emissive: new THREE.Color(activeColor),
      emissiveIntensity: isLit ? 1.2 : 0,
    });

    group.add(new THREE.Mesh(geometry, mat));

    if (isLit) {
      const light = new THREE.PointLight(color, 3.5, 120);
      group.add(light);
    }

    if (node.flag === "red" && isLit) {
      let frame = 0;
      const pulse = () => {
        frame++;
        mat.emissiveIntensity = 0.7 + Math.sin(frame / 12) * 0.8;
        requestAnimationFrame(pulse);
      };
      pulse();
    }

    return group;
  }, [focusedNode, highlightNodes]);

  const getNodeLabel = useCallback((node: any) => {
    const color = node.flag ? FLAG_COLORS[node.flag] : TYPE_COLORS[node.type];
    const detail = node.type === "fund_manager"
      ? `AUM: $${node.aum}B &nbsp;|&nbsp; Risk: ${node.riskScore}/100`
      : node.type === "holding" ? `Sector: ${node.sector}`
      : "Prime Broker / Custodian";

    return `<div style="background:rgba(8,8,20,0.96);padding:10px 14px;
      border-radius:6px;border:1px solid ${color};color:#fff;
      font-family:Inter,sans-serif;font-size:12px;pointer-events:none">
      <b style="color:${color};font-size:13px">${node.name}</b>
      <br/>${detail}</div>`;
  }, []);

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      background: "radial-gradient(ellipse at 40% 50%, #0a0e1a 0%, #060810 60%, #000000 100%)"
    }}>
      <style>{`
        @keyframes focusPulse {
          0%, 100% { border-color: var(--pulse-color); box-shadow: 0 0 16px var(--pulse-color); }
          50% { border-color: transparent; box-shadow: 0 0 4px transparent; }
        }
      `}</style>
      <div style={{
        position: "absolute", top: 16, left: 16, zIndex: 10,
        background: "rgba(8,8,20,0.92)", border: "1px solid #2a2a3a",
        borderRadius: 8, padding: "12px 16px", color: "#fff",
        fontFamily: "Inter,sans-serif", fontSize: 12
      }}>
        <div style={{ color: "#C9A84C", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>
          INTERCONNECTION MAP
        </div>
        {[
          { color: "#22C55E", shape: "●", label: "Fund Manager" },
          { color: "#3B82F6", shape: "■", label: "Top Positions" },
          { color: "#C9A84C", shape: "◆", label: "Custodian / Prime Broker" },
        ].map(({ color, shape, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ color, fontSize: 16 }}>{shape}</span>
            <span style={{ color: "#aaa" }}>{label}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #2a2a3a", marginTop: 8, paddingTop: 8, color: "#666", fontSize: 11 }}>
          Click any node to focus
        </div>
      </div>

      {focusedNode?.type === "fund_manager" && (
        <div style={{
          position: "absolute", top: 16, right: 16, zIndex: 10, width: 220,
          background: "rgba(8,8,20,0.96)",
          border: `1px solid ${FLAG_COLORS[focusedNode.flag] || "#C9A84C"}`,
          borderRadius: 8, padding: "12px 16px", color: "#fff",
          fontFamily: "Inter,sans-serif", fontSize: 12,
          animation: "focusPulse 2s ease-in-out infinite",
          ["--pulse-color" as any]: FLAG_COLORS[focusedNode.flag] || "#ffd700",
        }}>
          <div style={{ color: FLAG_COLORS[focusedNode.flag], fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
            {focusedNode.name}
          </div>
          <div style={{ color: "#ccc", lineHeight: 1.9 }}>
            Strategy: {focusedNode.strategy}<br />
            AUM: ${focusedNode.aum}B<br />
            Risk Score: <span style={{
              color: focusedNode.riskScore > 50 ? "#EF4444"
                : focusedNode.riskScore > 30 ? "#F59E0B" : "#22C55E"
            }}>{focusedNode.riskScore}/100</span><br />
            Status: <span style={{ color: FLAG_COLORS[focusedNode.flag] }}>
              {focusedNode.flag === "red" ? "⚠ ELEVATED RISK"
                : focusedNode.flag === "yellow" ? "MONITOR" : "CLEAR"}
            </span>
          </div>
        </div>
      )}

      <ForceGraph3D
        ref={fgRef as any}
        graphData={graphData}
        backgroundColor="rgba(0,0,0,0)"
        nodeThreeObject={getNodeObject as any}
        nodeLabel={getNodeLabel}
        nodeThreeObjectExtend={false}
        linkColor={(link: any) => {
          if (!focusedNode) return link.type === "custodied_by" ? "#ffd700" : "#00aaff";
          return highlightLinks.has(link) ? (link.type === "custodied_by" ? "#ffd700" : "#00aaff") : "#0a0a14";
        }}
        linkWidth={(link: any) => highlightLinks.has(link) ? 3 : 0.4}
        linkOpacity={0.35}
        linkDirectionalParticles={(link: any) => highlightLinks.has(link) ? 4 : 0}
        linkDirectionalParticleSpeed={0.003}
        linkDirectionalParticleWidth={(link: any) => highlightLinks.has(link) ? 4 : 1}
        linkDirectionalParticleColor={(link: any) =>
          link.type === "custodied_by" ? "#ffd700" : "#00aaff"
        }
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        warmupTicks={40}
        cooldownTicks={75}
        d3AlphaDecay={0.04}
        d3VelocityDecay={0.6}
      />
    </div>
  );
}
