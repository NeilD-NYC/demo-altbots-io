import { useRef, useCallback, useState, useEffect } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import { Search, X } from "lucide-react";
import SeoHead from "@/components/SeoHead";

// Galaxy color palette
const GALAXY_COLORS = {
  fundGreen: "#00ffaa",
  fundGreenDim: "#004d33",
  holdingBlue: "#4dc9f6",
  holdingBlueDim: "#0d2a3a",
  custodianGold: "#ffd866",
  custodianGoldDim: "#3a2e00",
  redAlert: "#ff4466",
  yellowAlert: "#ffcc44",
  nebulaPurple: "#6b3fa0",
  nebulaBlue: "#1a3a6a",
  starWhite: "#e8e8ff",
};

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
  green: GALAXY_COLORS.fundGreen, yellow: GALAXY_COLORS.yellowAlert, red: GALAXY_COLORS.redAlert
};

const TYPE_COLORS: Record<string, string> = {
  fund_manager: GALAXY_COLORS.fundGreen, holding: GALAXY_COLORS.holdingBlue, custodian: GALAXY_COLORS.custodianGold
};

// Create a planet texture with subtle banding
function createPlanetTexture(baseColor: string, size = 128): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = new THREE.Color(baseColor);
  
  // Base gradient
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `hsl(${Math.round(c.getHSL({h:0,s:0,l:0}).h * 360)}, ${Math.round(c.getHSL({h:0,s:0,l:0}).s * 100)}%, ${Math.round(c.getHSL({h:0,s:0,l:0}).l * 120)}%)`);
  grad.addColorStop(0.7, baseColor);
  grad.addColorStop(1, `hsl(${Math.round(c.getHSL({h:0,s:0,l:0}).h * 360)}, ${Math.round(c.getHSL({h:0,s:0,l:0}).s * 100)}%, ${Math.round(c.getHSL({h:0,s:0,l:0}).l * 40)}%)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  
  // Horizontal banding for gas-giant look
  for (let i = 0; i < 6; i++) {
    const y = (size / 7) * (i + 1);
    ctx.strokeStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.04})`;
    ctx.lineWidth = 2 + Math.random() * 3;
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(i) * 3);
    ctx.bezierCurveTo(size * 0.3, y - 2, size * 0.7, y + 2, size, y);
    ctx.stroke();
  }
  
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// Create atmosphere glow sprite
function createAtmosphereGlow(color: string, radius: number): THREE.Sprite {
  const canvas = document.createElement("canvas");
  const s = 256;
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(s / 2, s / 2, s * 0.15, s / 2, s / 2, s / 2);
  grad.addColorStop(0, color + "33");
  grad.addColorStop(0.4, color + "18");
  grad.addColorStop(0.7, color + "08");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, s, s);
  
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(radius * 3, radius * 3, 1);
  return sprite;
}

// Create orbital ring for custodian nodes
function createOrbitalRing(color: string, radius: number): THREE.Line {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius * 1.6, Math.sin(angle) * radius * 0.3, Math.sin(angle) * radius * 1.6));
  }
  const geom = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 });
  return new THREE.Line(geom, mat);
}

// Starfield background particles
function createStarfield(scene: THREE.Scene) {
  const starCount = 2000;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  
  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    
    const brightness = 0.5 + Math.random() * 0.5;
    const tint = Math.random();
    colors[i * 3] = tint > 0.7 ? brightness : brightness * 0.8;
    colors[i * 3 + 1] = brightness * 0.85;
    colors[i * 3 + 2] = tint < 0.3 ? brightness : brightness * 0.9;
    
    sizes[i] = 0.5 + Math.random() * 2;
  }
  
  const starGeom = new THREE.BufferGeometry();
  starGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  starGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  
  const starMat = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  
  scene.add(new THREE.Points(starGeom, starMat));
  
  // Nebula clouds - large soft sprites
  const nebulaColors = ["#2a1050", "#0d2a5a", "#1a0a3a", "#0a1a3a"];
  for (let i = 0; i < 8; i++) {
    const canvas = document.createElement("canvas");
    const s = 512;
    canvas.width = s;
    canvas.height = s;
    const ctx = canvas.getContext("2d")!;
    const nc = nebulaColors[i % nebulaColors.length];
    const grad = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    grad.addColorStop(0, nc + "44");
    grad.addColorStop(0.5, nc + "22");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, s, s);
    
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.6 });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set((Math.random() - 0.5) * 800, (Math.random() - 0.5) * 800, (Math.random() - 0.5) * 800);
    sprite.scale.set(400 + Math.random() * 400, 400 + Math.random() * 400, 1);
    scene.add(sprite);
  }
}

export default function ConnectionGraph() {
  const fgRef = useRef<any>();
  const [focusedNode, setFocusedNode] = useState<any>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      fgRef.current?.cameraPosition({ x: 0, y: 0, z: 500 });
      const scene = fgRef.current?.scene?.();
      if (scene) {
        // Galaxy ambient lighting
        scene.add(new THREE.AmbientLight(0x1a1a3a, 0.6));
        // Distant "star" directional lights
        const starLight1 = new THREE.DirectionalLight(0x4466aa, 0.4);
        starLight1.position.set(200, 300, 400);
        scene.add(starLight1);
        const starLight2 = new THREE.DirectionalLight(0x6633aa, 0.3);
        starLight2.position.set(-300, -100, -200);
        scene.add(starLight2);
        // Starfield + nebula
        createStarfield(scene);
        // Soft fog for depth
        scene.fog = new THREE.FogExp2(0x050510, 0.0008);
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

  const selectNodeFromSearch = useCallback((nodeData: any) => {
    setSearchQuery(nodeData.name);
    setSearchOpen(false);
    // The graphData.nodes objects are mutated in-place by the force engine with x/y/z
    const liveNode = graphData.nodes.find((n: any) => n.id === nodeData.id);
    if (liveNode) handleNodeClick(liveNode as any);
  }, [handleNodeClick]);

  const handleBackgroundClick = useCallback(() => {
    setFocusedNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
  }, []);

  const getNodeObject = useCallback((node: any) => {
    const isLit = !focusedNode || highlightNodes.has(node);
    const color = node.flag ? FLAG_COLORS[node.flag] : TYPE_COLORS[node.type];

    const group = new THREE.Group();

    if (node.type === "fund_manager") {
      // Large planet with atmosphere
      const radius = Math.max(6, (node.aum || 1) * 1.2);
      const geometry = new THREE.SphereGeometry(radius, 48, 48);
      const texture = createPlanetTexture(isLit ? color : "#1a1a2a");
      const mat = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        opacity: isLit ? 1.0 : 0.15,
        emissive: new THREE.Color(isLit ? color : "#000"),
        emissiveIntensity: isLit ? 0.5 : 0,
        shininess: 40,
        specular: new THREE.Color(0x333344),
      });
      group.add(new THREE.Mesh(geometry, mat));
      
      // Atmospheric glow
      if (isLit) {
        group.add(createAtmosphereGlow(color, radius));
        const light = new THREE.PointLight(color, 2.5, 100);
        group.add(light);
      }
      
      // Pulse red planets
      if (node.flag === "red" && isLit) {
        let frame = 0;
        const pulse = () => {
          frame++;
          mat.emissiveIntensity = 0.3 + Math.sin(frame / 15) * 0.4;
          requestAnimationFrame(pulse);
        };
        pulse();
      }
    } else if (node.type === "holding") {
      // Small moon/asteroid planet
      const radius = 3.5;
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const texture = createPlanetTexture(isLit ? color : "#0d1a2a");
      const mat = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        opacity: isLit ? 0.95 : 0.1,
        emissive: new THREE.Color(isLit ? color : "#000"),
        emissiveIntensity: isLit ? 0.4 : 0,
        shininess: 30,
      });
      group.add(new THREE.Mesh(geometry, mat));
      if (isLit) {
        group.add(createAtmosphereGlow(color, radius));
      }
    } else { // custodian
      // Ringed planet (Saturn-like)
      const radius = 7;
      const geometry = new THREE.SphereGeometry(radius, 48, 48);
      const texture = createPlanetTexture(isLit ? color : "#1a1a10");
      const mat = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        opacity: isLit ? 1.0 : 0.12,
        emissive: new THREE.Color(isLit ? color : "#000"),
        emissiveIntensity: isLit ? 0.4 : 0,
        shininess: 50,
        specular: new THREE.Color(0x554400),
      });
      group.add(new THREE.Mesh(geometry, mat));
      if (isLit) {
        group.add(createAtmosphereGlow(color, radius));
        const light = new THREE.PointLight(color, 1.5, 80);
        group.add(light);
      }
    }

    return group;
  }, [focusedNode, highlightNodes]);

  const getNodeLabel = useCallback((node: any) => {
    const color = node.flag ? FLAG_COLORS[node.flag] : TYPE_COLORS[node.type];
    const detail = node.type === "fund_manager"
      ? `AUM: $${node.aum}B &nbsp;|&nbsp; Risk: ${node.riskScore}/100`
      : node.type === "holding" ? `Sector: ${node.sector}`
      : "Prime Broker / Custodian";

    return `<div style="background:rgba(8,8,30,0.75);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);padding:10px 14px;
      border-radius:10px;border:1px solid ${color}44;color:#fff;
      font-family:Inter,sans-serif;font-size:12px;pointer-events:none;
      box-shadow:0 0 20px ${color}22, 0 4px 20px rgba(0,0,0,0.5)">
      <b style="color:${color};font-size:13px">${node.name}</b>
      <br/>${detail}</div>`;
  }, []);

  // Glassmorphic panel style
  const glassPanel: React.CSSProperties = {
    background: "rgba(8, 10, 30, 0.55)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(100, 120, 180, 0.2)",
    borderRadius: 14,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
  };

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      background: "radial-gradient(ellipse at 30% 40%, #0d0a20 0%, #060818 40%, #020208 70%, #000005 100%)"
    }}>
      <SeoHead
        title="Interconnection Map — AltBots"
        description="3D force-directed visualization of fund, holding, and custodian relationships across the AltBots portfolio."
        path="/connections"
      />
      <style>{`
        @keyframes focusPulse {
          0%, 100% { border-color: var(--pulse-color); box-shadow: 0 0 16px var(--pulse-color); }
          50% { border-color: transparent; box-shadow: 0 0 4px transparent; }
        }
        @keyframes nebulaShift {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>
      {/* Nebula gradient overlays */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse at 70% 30%, rgba(80,40,140,0.12) 0%, transparent 50%), radial-gradient(ellipse at 20% 70%, rgba(20,60,120,0.1) 0%, transparent 50%)",
        animation: "nebulaShift 12s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: 16, left: 16, zIndex: 10, 
        ...glassPanel, padding: "14px 18px", color: "#fff",
        fontFamily: "Inter,sans-serif", fontSize: 12
      }}>
        <div style={{ color: "#C9A84C", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>
          GALAXY MAP
        </div>
        {[
          { color: GALAXY_COLORS.fundGreen, shape: "⬤", label: "Fund Manager" },
          { color: GALAXY_COLORS.holdingBlue, shape: "◉", label: "Top Positions" },
          { color: GALAXY_COLORS.custodianGold, shape: "◎", label: "Custodian / PB" },
        ].map(({ color, shape, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ color, fontSize: 14, textShadow: `0 0 8px ${color}66` }}>{shape}</span>
            <span style={{ color: "#b0b8d0" }}>{label}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid rgba(100,120,180,0.15)", marginTop: 8, paddingTop: 8, color: "#556", fontSize: 11 }}>
          Click any node to focus
        </div>
        <div style={{ borderTop: "1px solid rgba(100,120,180,0.15)", marginTop: 8, paddingTop: 8, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(10,12,30,0.6)", border: "1px solid rgba(100,120,180,0.2)", borderRadius: 8, padding: "5px 10px" }}>
            <Search size={14} color="#5566aa" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              style={{
                background: "transparent", border: "none", outline: "none",
                color: "#d0d8f0", fontSize: 12, width: "100%", fontFamily: "Inter,sans-serif"
              }}
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setSearchOpen(false); handleBackgroundClick(); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                <X size={14} color="#5566aa" />
              </button>
            )}
          </div>
          {searchOpen && searchQuery.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
              ...glassPanel, borderRadius: 10,
              maxHeight: 200, overflowY: "auto", zIndex: 20, padding: 4
            }}>
              {graphData.nodes
                .filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .slice(0, 15)
                .map(node => {
                  const color = (node as any).flag ? FLAG_COLORS[(node as any).flag] : TYPE_COLORS[node.type];
                  const typeLabel = node.type === "fund_manager" ? "⬤" : node.type === "holding" ? "◉" : "◎";
                  return (
                    <div
                      key={node.id}
                      onClick={() => selectNodeFromSearch(node)}
                      style={{
                        padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, borderRadius: 6,
                        fontSize: 12, color: "#b0b8d0",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(80,100,180,0.15)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                    >
                      <span style={{ color, fontSize: 12, textShadow: `0 0 6px ${color}66` }}>{typeLabel}</span>
                      <span>{node.name}</span>
                    </div>
                  );
                })}
              {graphData.nodes.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div style={{ padding: "8px 10px", color: "#445", fontSize: 12 }}>No results</div>
              )}
            </div>
          )}
        </div>
      </div>

      {focusedNode?.type === "fund_manager" && (
        <div style={{
          position: "absolute", top: 16, right: 16, zIndex: 10, width: 230,
          ...glassPanel,
          border: `1px solid ${FLAG_COLORS[focusedNode.flag] || "#C9A84C"}33`,
          padding: "14px 18px", color: "#fff",
          fontFamily: "Inter,sans-serif", fontSize: 12,
          animation: "focusPulse 2s ease-in-out infinite",
          ["--pulse-color" as any]: FLAG_COLORS[focusedNode.flag] || "#ffd700",
        }}>
          <div style={{ color: FLAG_COLORS[focusedNode.flag], fontWeight: 700, fontSize: 14, marginBottom: 8, textShadow: `0 0 12px ${FLAG_COLORS[focusedNode.flag]}44` }}>
            {focusedNode.name}
          </div>
          <div style={{ color: "#b0b8d0", lineHeight: 1.9 }}>
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
          if (!focusedNode) return link.type === "custodied_by" ? "#ffd866aa" : "#4dc9f6aa";
          return highlightLinks.has(link) ? (link.type === "custodied_by" ? "#ffd866" : "#4dc9f6") : "#0a0a2a";
        }}
        linkWidth={(link: any) => highlightLinks.has(link) ? 2.5 : 0.8}
        linkOpacity={0.7}
        linkDirectionalParticles={(link: any) => highlightLinks.has(link) ? 4 : 0}
        linkDirectionalParticleSpeed={0.003}
        linkDirectionalParticleWidth={(link: any) => highlightLinks.has(link) ? 3 : 1}
        linkDirectionalParticleColor={(link: any) =>
          link.type === "custodied_by" ? "#ffd866" : "#4dc9f6"
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
