import React, { useEffect, useState, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
  ConnectionMode,
  Background,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Importaciones de componentes
import NodeButton from "./NodeButton";
import H1Title from "./H1Title";
import Tema from "./Tema";
import Subtema from "./Subtema";
import Parrafo from "./Parrafo";
import ToDo from "./ToDo";
import Link from "./Link";
import Seccion from "./Seccion";
import Etiqueta from "./Etiqueta";
import BiDirectionalEdge from "./BiDirectionalEdge";

interface PreviewRoadmapProps {
  structure: {
    nodes: Node[];
    edges: Edge[];
  };
}

const nodeTypes = {
  nodeButton: NodeButton,
  h1: H1Title,
  tema: Tema,
  subtema: Subtema,
  parrafo: Parrafo,
  todo: ToDo,
  etiqueta: Etiqueta,
  link: Link,
  seccion: Seccion,
};

const edgeTypes = {
  bidirectional: BiDirectionalEdge,
};

const PreviewRoadmapContent = ({ structure }: PreviewRoadmapProps) => {
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { fitView, setViewport } = useReactFlow();

  // Obtener las dimensiones del contenedor
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerDimensions({ width, height });
    }
  }, []);

  // Ajustar el viewport para centrar y ver todos los componentes
  useEffect(() => {
    if (structure?.nodes?.length && containerDimensions.width && containerDimensions.height) {
      // Calcular los límites del contenido
      const bounds = structure.nodes.reduce(
        (acc, node) => ({
          minX: Math.min(acc.minX, node.position.x),
          maxX: Math.max(acc.maxX, node.position.x + (node.width || 100)), // Incluir el ancho del nodo
          minY: Math.min(acc.minY, node.position.y),
          maxY: Math.max(acc.maxY, node.position.y + (node.height || 50)), // Incluir el alto del nodo
        }),
        {
          minX: Infinity,
          maxX: -Infinity,
          minY: Infinity,
          maxY: -Infinity,
        }
      );

      const contentWidth = bounds.maxX - bounds.minX;
      const contentHeight = bounds.maxY - bounds.minY;

      // Calcular el zoom para que todo el contenido entre en el contenedor
      const zoomX = (containerDimensions.width - 40) / contentWidth;
      const zoomY = (containerDimensions.height - 40) / contentHeight;
      const zoom = Math.min(Math.min(zoomX, zoomY, 1), 0.8); // Limitar el zoom máximo a 0.8

      // Calcular el centro del contenido
      const centerX = bounds.minX + contentWidth / 2;
      const centerY = bounds.minY + contentHeight / 2;

      // Ajustar el viewport para centrar el contenido
      setTimeout(() => {
        setViewport({
          x: containerDimensions.width / 2 - centerX * zoom,
          y: containerDimensions.height / 2 - centerY * zoom,
          zoom,
        });
      }, 50);
    }
  }, [structure?.nodes, containerDimensions, fitView, setViewport]);

  return (
    <div ref={containerRef} className="w-full h-full pointer-events-none">
      <ReactFlow
        nodes={structure?.nodes || []}
        edges={structure?.edges || []}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: true,
        }}
        className="touch-none"
        style={{ backgroundColor: '#f5f5f5' }}
        proOptions={{ hideAttribution: true }}
        zoomOnScroll={false}
        panOnScroll={false}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        minZoom={0.1}
        maxZoom={0.8}
        preventScrolling={true}
        panOnDrag={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        selectNodesOnDrag={false}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
        />
      </ReactFlow>
    </div>
  );
};

const PreviewRoadmap = (props: PreviewRoadmapProps) => {
  return (
    <div className="w-full h-48 bg-white rounded-lg shadow-sm overflow-hidden">
      <ReactFlowProvider>
        <PreviewRoadmapContent {...props} />
      </ReactFlowProvider>
    </div>
  );
};

export default PreviewRoadmap;