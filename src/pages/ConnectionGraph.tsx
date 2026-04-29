import { useRef, useCallback, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { graphData } from "@/data/graphData";
import { Search, X } from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
  fund_manager: "#EF4444",
  holding: "#3B82F6",
  custodian: "#C9A84C",
};

const FLAG_COLORS: Record<string, string> = {
  green: "#22C55E",
  yellow: "#F59E0B",
  red: "#EF4444",
};

type GraphNode = {
  id: string;
  name: string;
  type: string;
  aum?: number;
  strategy?: string;
  riskScore?: number;
  flag?: keyof typeof FLAG_COLORS;
  sector?: string;
  x?: number;
  y?: number;
  z?: number;
};

type GraphLink = {
  source: string | GraphNode;
  target: string | GraphNode;
  type: string;
  weight?: number;
};

const getEndpointId = (endpoint: string | { id: string }) =>
  typeof endpoint === "object" ? endpoint.id : endpoint;

const getLinkKey = (link: GraphLink, index: number) =>
  `${getEndpointId(link.source)}-${getEndpointId(link.target)}-${link.type}-${index}`;

const getNodeColor = (node: GraphNode) =>
  node.flag ? FLAG_COLORS[node.flag] : TYPE_COLORS[node.type] || "#C9A84C";

const getLinkColor = (link: GraphLink) =>
  link.type === "custodied_by" ? "#C9A84C" : "#3B82F6";

export default function ConnectionGraph() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const runtimeNodesRef = useRef<GraphNode[]>([]);
  const nodeMeshesRef = useRef(new Map<string, THREE.Mesh>());
  const linkLinesRef = useRef<Array<{ key: string; link: GraphLink; line: THREE.Line }>>([]);
  const linkHalosRef = useRef<Array<{ key: string; halo: THREE.Line }>>([]);
  const alertMeshesRef = useRef<THREE.Mesh[]>([]);
  const animationFrameRef = useRef<number>();

  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [focusedNode, setFocusedNode] = useState<GraphNode | null>(null);
  const [highlightNodeIds, setHighlightNodeIds] = useState(new Set<string>());
  const [highlightLinkKeys, setHighlightLinkKeys] = useState(new Set<string>());
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const nodeById = useMemo(() => new Map((graphData.nodes as GraphNode[]).map((node) => [node.id, node])), []);

  const filteredNodes = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return (graphData.nodes as GraphNode[]).filter((node) => node.name.toLowerCase().includes(q)).slice(0, 8);
  }, [searchQuery]);

  const focusCameraOnNode = useCallback((node: GraphNode) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls || node.x == null) return;

    const target = new THREE.Vector3(node.x, node.y, node.z);
    const direction = target.clone().normalize();
    if (direction.lengthSq() === 0) direction.set(0, 0, 1);

    camera.position.copy(target.clone().add(direction.multiplyScalar(135)));
    controls.target.copy(target);
    controls.update();
  }, []);

  const selectNode = useCallback((node: GraphNode) => {
    const newNodeIds = new Set<string>([node.id]);
    const newLinkKeys = new Set<string>();

    graphData.links.forEach((link: GraphLink, index: number) => {
      const sourceId = getEndpointId(link.source);
      const targetId = getEndpointId(link.target);
      if (sourceId === node.id || targetId === node.id) {
        newLinkKeys.add(getLinkKey(link, index));
        newNodeIds.add(sourceId);
        newNodeIds.add(targetId);
      }
    });

    setHighlightNodeIds(newNodeIds);
    setHighlightLinkKeys(newLinkKeys);
    setFocusedNode(node);
    focusCameraOnNode(node);
  }, [focusCameraOnNode]);

  const handleSearchSelect = useCallback((node: GraphNode) => {
    const runtimeNode = runtimeNodesRef.current.find((runtime) => runtime.id === node.id) || node;
    setSearchQuery(node.name);
    setShowDropdown(false);
    selectNode(runtimeNode);
  }, [selectNode]);

  const handleBackgroundClick = useCallback(() => {
    setFocusedNode(null);
    setHighlightNodeIds(new Set());
    setHighlightLinkKeys(new Set());
  }, []);

  const getEmissiveForNode = (node: GraphNode): { color: string; intensity: number } => {
    if (node.flag === "red") return { color: "#ff3333", intensity: 0.8 };
    if (node.type === "fund_manager") return { color: "#00ff88", intensity: 0.5 };
    if (node.type === "holding") return { color: "#4488ff", intensity: 0.4 };
    if (node.type === "custodian") return { color: "#C5A55A", intensity: 0.6 };
    return { color: "#C5A55A", intensity: 0.4 };
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0D1117");

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(58, width / height, 1, 2000);
    camera.position.set(0, 40, 285);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.55;
    controls.zoomSpeed = 0.8;
    controls.minDistance = 80;
    controls.maxDistance = 620;
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.58));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(80, 120, 160);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x3b82f6, 0.45);
    rimLight.position.set(-120, -40, -100);
    scene.add(rimLight);

    const fundManagers = graphData.nodes.filter((node: GraphNode) => node.type === "fund_manager");
    const holdings = graphData.nodes.filter((node: GraphNode) => node.type === "holding");
    const custodians = graphData.nodes.filter((node: GraphNode) => node.type === "custodian");

    const positionedNodes = graphData.nodes.map((node: GraphNode) => ({ ...node }));
    const positionById = new Map<string, GraphNode>();

    positionedNodes.forEach((node: GraphNode) => {
      if (node.type === "fund_manager") {
        const index = fundManagers.findIndex((item: GraphNode) => item.id === node.id);
        const y = -82 + (164 * index) / Math.max(fundManagers.length - 1, 1);
        const radiusAtY = Math.sqrt(Math.max(0.15, 1 - Math.pow(y / 100, 2))) * 126;
        const angle = index * 2.399963229728653;
        node.x = Math.cos(angle) * radiusAtY;
        node.y = y;
        node.z = Math.sin(angle) * radiusAtY;
      } else if (node.type === "holding") {
        const index = holdings.findIndex((item: GraphNode) => item.id === node.id);
        const angle = (index / holdings.length) * Math.PI * 2;
        node.x = Math.cos(angle) * 56;
        node.y = 22 + Math.sin(index * 1.7) * 18;
        node.z = Math.sin(angle) * 56;
      } else {
        const index = custodians.findIndex((item: GraphNode) => item.id === node.id);
        const angle = (index / custodians.length) * Math.PI * 2 + Math.PI / 5;
        node.x = Math.cos(angle) * 72;
        node.y = -112;
        node.z = Math.sin(angle) * 72;
      }
      positionById.set(node.id, node);
    });

    runtimeNodesRef.current = positionedNodes;

    linkLinesRef.current = graphData.links.map((link: GraphLink, index: number) => {
      const source = positionById.get(getEndpointId(link.source));
      const target = positionById.get(getEndpointId(link.target));
      const points = [
        new THREE.Vector3(source?.x || 0, source?.y || 0, source?.z || 0),
        new THREE.Vector3(target?.x || 0, target?.y || 0, target?.z || 0),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: getLinkColor(link),
        transparent: true,
        opacity: link.type === "custodied_by" ? 0.5 : 0.42,
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);

      // Halo line behind for soft glow
      const haloGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const haloMaterial = new THREE.LineBasicMaterial({
        color: getLinkColor(link),
        transparent: true,
        opacity: 0.15,
        linewidth: 2,
      });
      const halo = new THREE.Line(haloGeometry, haloMaterial);
      scene.add(halo);
      linkHalosRef.current.push({ key: getLinkKey(link, index), halo });

      return { key: getLinkKey(link, index), link, line };
    });

    const nodeMeshMap = nodeMeshesRef.current;
    nodeMeshMap.clear();
    const nodeMeshes: THREE.Mesh[] = [];
    alertMeshesRef.current = [];
    positionedNodes.forEach((node: GraphNode) => {
      const geometry = node.type === "fund_manager"
        ? new THREE.SphereGeometry(node.aum ? Math.max(4, node.aum * 0.8) : 6, 18, 18)
        : node.type === "holding"
          ? new THREE.BoxGeometry(5, 5, 5)
          : new THREE.OctahedronGeometry(7);
      const emissive = getEmissiveForNode(node);
      const material = new THREE.MeshStandardMaterial({
        color: getNodeColor(node),
        emissive: new THREE.Color(emissive.color),
        emissiveIntensity: emissive.intensity,
        transparent: true,
        opacity: 0.92,
        roughness: 0.55,
        metalness: 0.15,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(node.x, node.y, node.z);
      mesh.userData.node = node;
      mesh.userData.baseEmissiveIntensity = emissive.intensity;
      scene.add(mesh);
      nodeMeshes.push(mesh);
      nodeMeshMap.set(node.id, mesh);
      if (node.flag === "red") alertMeshesRef.current.push(mesh);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const updatePointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const getIntersectedNode = (event: PointerEvent) => {
      updatePointer(event);
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(nodeMeshes, false)[0]?.object.userData.node || null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const node = getIntersectedNode(event);
      setHoveredNode(node);
      setMousePos({ x: event.clientX, y: event.clientY });
      renderer.domElement.style.cursor = node ? "pointer" : "grab";
    };

    const handlePointerLeave = () => {
      setHoveredNode(null);
      renderer.domElement.style.cursor = "grab";
    };

    const handlePointerClick = (event: PointerEvent) => {
      const node = getIntersectedNode(event);
      if (node) selectNode(node);
      else handleBackgroundClick();
    };

    const handleResize = () => {
      const nextWidth = container.clientWidth || width;
      const nextHeight = container.clientHeight || height;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    renderer.domElement.addEventListener("click", handlePointerClick);
    window.addEventListener("resize", handleResize);

    const animate = () => {
      controls.update();
      // Pulse alert (red) nodes between 0.4 and 1.0 on a 2s sine loop
      const t = performance.now() / 1000;
      const pulse = 0.7 + 0.3 * Math.sin((t * Math.PI * 2) / 2); // 0.4 .. 1.0
      alertMeshesRef.current.forEach((mesh) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = pulse;
      });
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      renderer.domElement.removeEventListener("click", handlePointerClick);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
      rendererRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      runtimeNodesRef.current = [];
      nodeMeshMap.clear();
      linkLinesRef.current = [];
      linkHalosRef.current = [];
      alertMeshesRef.current = [];
    };
  }, [handleBackgroundClick, selectNode]);

  useEffect(() => {
    nodeMeshesRef.current.forEach((mesh, nodeId) => {
      const node = runtimeNodesRef.current.find((item) => item.id === nodeId) || nodeById.get(nodeId);
      if (!node) return;
      const material = mesh.material as THREE.MeshStandardMaterial;
      const isActive = !focusedNode || highlightNodeIds.has(nodeId);
      material.color.set(isActive ? getNodeColor(node) : "#222233");
      material.opacity = isActive ? 0.92 : 0.15;
      const emissive = getEmissiveForNode(node);
      material.emissive.set(isActive ? emissive.color : "#000000");
      mesh.userData.baseEmissiveIntensity = isActive ? emissive.intensity : 0;
      if (node.flag !== "red") material.emissiveIntensity = isActive ? emissive.intensity : 0;
    });

    linkLinesRef.current.forEach(({ key, link, line }) => {
      const material = line.material as THREE.LineBasicMaterial;
      const isActive = !focusedNode || highlightLinkKeys.has(key);
      material.color.set(isActive ? getLinkColor(link) : "#111122");
      material.opacity = isActive ? (link.type === "custodied_by" ? 0.55 : 0.45) : 0.12;
    });

    linkHalosRef.current.forEach(({ key, halo }) => {
      const material = halo.material as THREE.LineBasicMaterial;
      const isActive = !focusedNode || highlightLinkKeys.has(key);
      material.opacity = isActive ? 0.15 : 0.04;
    });
  }, [focusedNode, highlightLinkKeys, highlightNodeIds, nodeById]);

  const tooltipHtml = useMemo(() => {
    if (!hoveredNode) return null;
    const color = TYPE_COLORS[hoveredNode.type] || "#C9A84C";
    return [
      <b key="name" style={{ color, fontSize: 13 }}>{hoveredNode.name}</b>,
      hoveredNode.type === "fund_manager" ? <span key="aum"><br />AUM: ${hoveredNode.aum}B | Risk: {hoveredNode.riskScore}/100</span> : null,
      hoveredNode.type === "holding" ? <span key="sector"><br />Sector: {hoveredNode.sector}</span> : null,
      hoveredNode.type === "custodian" ? <span key="custodian"><br />Prime Broker / Custodian</span> : null,
    ];
  }, [hoveredNode]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#0D1117" }}>
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "radial-gradient(ellipse at center, rgba(197, 165, 90, 0.03) 0%, transparent 70%)",
        }}
      />

      {tooltipHtml && (
        <div style={{
          position: "fixed",
          left: mousePos.x + 14,
          top: mousePos.y + 14,
          zIndex: 30,
          background: "rgba(10,10,30,0.95)",
          padding: "10px 14px",
          borderRadius: 6,
          border: `1px solid ${TYPE_COLORS[hoveredNode?.type] || "#C9A84C"}`,
          color: "#fff",
          fontFamily: "Inter, sans-serif",
          pointerEvents: "none",
        }}>
          {tooltipHtml}
        </div>
      )}

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
          { color: "#3B82F6", shape: "■", label: "Top Positions" },
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
        <div style={{ borderTop: "1px solid #30363D", marginTop: 8, paddingTop: 8, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#0D1117", border: "1px solid #30363D", borderRadius: 6, padding: "4px 8px" }}>
            <Search size={14} color="#888" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              style={{
                background: "transparent", border: "none", outline: "none",
                color: "#fff", fontSize: 12, width: "100%", fontFamily: "Inter, sans-serif"
              }}
            />
            {searchQuery && (
              <X size={14} color="#888" style={{ cursor: "pointer" }} onClick={() => {
                setSearchQuery("");
                setShowDropdown(false);
                handleBackgroundClick();
              }} />
            )}
          </div>
          {showDropdown && filteredNodes.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
              background: "rgba(10,10,30,0.95)", border: "1px solid #30363D",
              borderRadius: 6, overflow: "hidden", zIndex: 20
            }}>
              {filteredNodes.map((node: GraphNode) => (
                <div
                  key={node.id}
                  onClick={() => handleSearchSelect(node)}
                  style={{
                    padding: "6px 10px", cursor: "pointer", fontSize: 12,
                    color: "#ccc", display: "flex", alignItems: "center", gap: 8,
                    borderBottom: "1px solid #1a1f2b"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1a2332")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ color: TYPE_COLORS[node.type] || "#C9A84C", fontSize: 14 }}>
                    {node.type === "fund_manager" ? "●" : node.type === "holding" ? "■" : "◆"}
                  </span>
                  {node.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
}
