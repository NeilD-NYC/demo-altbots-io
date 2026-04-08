import { useRef, useCallback, useState, useEffect, useMemo } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { graphData } from "@/data/graphData";

const TYPE_COLORS: Record<string, string> = {
  fund_manager: "#EF4444",
  holding:      "#3B82F6",
  custodian:    "#C9A84C",
};

const FLAG_COLORS: Record<string, string> = {
  green:  "#22C55E",
  yellow: "#F59E0B",
  red:    "#EF4444",
};

export default function ConnectionGraph() {
  const fgRef = useRef<any>();
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [focusedNode, setFocusedNode] = useState<any>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());

  const neighborMap = useRef<Record<string, Set<string>>>({});
  const linkSet = useRef(new Set<any>());

  useEffect(() => {
    graphData.links.forEach(link => {
      const s = link.source as string;
      const t = link.target as string;
      if (!neighborMap.current[s]) neighborMap.current[s] = new Set();
      if (!neighborMap.current[t]) neighborMap.current[t] = new Set();
      neighborMap.current[s].add(t);
      neighborMap.current[t].add(s);
    });
  }, []);

  // Configure d3 forces for wider spacing
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;

    // Increase repulsion between nodes
    fg.d3Force('charge')?.strength(-350).distanceMax(600);
    // Increase link distance
    fg.d3Force('link')?.distance(120);
    // Add center force to keep graph from drifting
    fg.d3Force('center')?.strength(0.03);

    // Add UnrealBloomPass for neon glow effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.8,  // strength
      0.6,  // radius
      0.1   // threshold
    );
    fg.postProcessingComposer().addPass(bloomPass);
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    const distance = 120;
    const distRatio = 1 + distance / Math.hypot(node.x || 1, node.y || 1, node.z || 1);
    fgRef.current?.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
      node,
      1500
    );

    const newNodes = new Set<any>();
    const newLinks = new Set<any>();
    newNodes.add(node);
    graphData.links.forEach((link: any) => {
      const s = typeof link.source === "object" ? link.source.id : link.source;
      const t = typeof link.target === "object" ? link.target.id : link.target;
      if (s === node.id || t === node.id) {
        newLinks.add(link);
        graphData.nodes.forEach(n => {
          if (n.id === s || n.id === t) newNodes.add(n);
        });
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
    const color = focusedNode
      ? (highlightNodes.has(node) ? (node.flag ? FLAG_COLORS[node.flag] : TYPE_COLORS[node.type]) : "#222233")
      : (node.flag ? FLAG_COLORS[node.flag] : TYPE_COLORS[node.type]);

    const material = new THREE.MeshLambertMaterial({
      color,
      transparent: true,
      opacity: focusedNode && !highlightNodes.has(node) ? 0.15 : 0.9,
    });

    let geometry;
    if (node.type === "fund_manager") {
      geometry = new THREE.SphereGeometry(node.aum ? Math.max(4, node.aum * 0.8) : 6, 16, 16);
    } else if (node.type === "holding") {
      geometry = new THREE.BoxGeometry(5, 5, 5);
    } else {
      geometry = new THREE.OctahedronGeometry(7);
    }

    return new THREE.Mesh(geometry, material);
  }, [focusedNode, highlightNodes]);

  const getNodeLabel = useCallback((node: any) => {
    const color = TYPE_COLORS[node.type];
    const lines = [
      `<b style="color:${color};font-size:13px">${node.name}</b>`,
      node.type === "fund_manager" ? `AUM: $${node.aum}B | Risk: ${node.riskScore}/100` : "",
      node.type === "holding" ? `Sector: ${node.sector}` : "",
      node.type === "custodian" ? "Prime Broker / Custodian" : "",
    ].filter(Boolean).join("<br/>");

    return `<div style="background:rgba(10,10,30,0.95);padding:10px 14px;
      border-radius:6px;border:1px solid ${color};color:#fff;
      font-family:Inter,sans-serif;pointer-events:none">${lines}</div>`;
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#0D1117" }}>
      {/* Legend */}
      <div style={{
        position: "absolute", top: 16, left: 16, zIndex: 10,
        background: "rgba(10,10,30,0.9)", border: "1px solid #30363D",
        borderRadius: 8, padding: "12px 16px", color: "#fff",
        fontFamily: "Inter, sans-serif", fontSize: 12
      }}>
        <div style={{ color: "#C9A84C", fontWeight: 700, marginBottom: 8 }}>
          INTERCONNECTION MAP
        </div>
        {[
          { color: "#EF4444", shape: "●", label: "Fund Manager" },
          { color: "#3B82F6", shape: "■", label: "13F Holding" },
          { color: "#C9A84C", shape: "◆", label: "Custodian / Prime Broker" },
        ].map(({ color, shape, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ color, fontSize: 16 }}>{shape}</span>
            <span style={{ color: "#ccc" }}>{label}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #30363D", marginTop: 8, paddingTop: 8, color: "#888" }}>
          Click any node to focus
        </div>
      </div>

      {/* Focus panel */}
      {focusedNode && focusedNode.type === "fund_manager" && (
        <div style={{
          position: "absolute", top: 16, right: 16, zIndex: 10, width: 220,
          background: "rgba(10,10,30,0.95)", border: `1px solid ${FLAG_COLORS[focusedNode.flag] || "#C9A84C"}`,
          borderRadius: 8, padding: "12px 16px", color: "#fff",
          fontFamily: "Inter, sans-serif", fontSize: 12
        }}>
          <div style={{ color: FLAG_COLORS[focusedNode.flag], fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
            {focusedNode.name}
          </div>
          <div style={{ color: "#ccc", lineHeight: 1.8 }}>
            Strategy: {focusedNode.strategy}<br />
            AUM: ${focusedNode.aum}B<br />
            Risk Score: <span style={{
              color: focusedNode.riskScore > 50 ? "#EF4444" : focusedNode.riskScore > 30 ? "#F59E0B" : "#22C55E"
            }}>{focusedNode.riskScore}/100</span><br />
            Status: <span style={{ color: FLAG_COLORS[focusedNode.flag] }}>
              {focusedNode.flag === "red" ? "⚠ ELEVATED RISK" : focusedNode.flag === "yellow" ? "MONITOR" : "CLEAR"}
            </span>
          </div>
        </div>
      )}

      {/* @ts-ignore */}
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        backgroundColor="#0D1117"
        nodeThreeObject={getNodeObject}
        nodeLabel={getNodeLabel}
        nodeThreeObjectExtend={false}
        linkColor={(link: any) => {
          if (!focusedNode) return link.type === "custodied_by" ? "#C9A84C" : "#3B82F6";
          return highlightLinks.has(link) ? (link.type === "custodied_by" ? "#C9A84C" : "#3B82F6") : "#111122";
        }}
        linkWidth={(link: any) => highlightLinks.has(link) ? 2 : 0.5}
        linkOpacity={0.6}
        linkDirectionalParticles={(link: any) => highlightLinks.has(link) ? 4 : 1}
        linkDirectionalParticleSpeed={0.004}
        linkDirectionalParticleWidth={(link: any) => highlightLinks.has(link) ? 2.5 : 1}
        linkDirectionalParticleColor={(link: any) =>
          link.type === "custodied_by" ? "#C9A84C" : "#3B82F6"
        }
        onNodeClick={handleNodeClick}
        onBackgroundClick={handleBackgroundClick}
        warmupTicks={120}
        cooldownTicks={200}
        d3AlphaDecay={0.015}
        d3VelocityDecay={0.25}
      />
    </div>
  );
}
